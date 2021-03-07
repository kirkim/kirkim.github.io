---
layout: post
title:  "[C]연결리스트(linked list)"
subtitle:   ""
date: 2021-03-05 02:45:51 +0900
categories: c
tags: etc
comments: true 
---

이번 포스트는 **연결리스트(linked list)**에 관한 내용입니다.

* * *
<h2>1️⃣ 연결리스트란?</h2>
* **연결리스트(linked list)**는 각 노드가 <b style="color:#2facff;">데이터</b>와 <b style="color:#ff2fa9;">포인터</b>를 가지고 한 줄로 연결되어 있는 방식으로 **데이터를 저장**하는 **자료 구조**입니다.
* **연결 리스트의 각 자료**를 <b style="color:#ffc82f;">노드(node)</b>라고 부릅니다.
* 필요에 따라 **동적 메모리**를 별도로 할당하여 **노드**를 만듭니다.
* 각 노드에 있는 **포인터 변수**에 <b style="color:#d83bff;">다음 노드의 메모리 주소</b>를 저장하고 제일 **마지막 노드**는 <b style="color:#bc1dca;">NULL포인터</b>를 저장합니다.
* **메모리 관리**능력과 **이중 포인터**사용 능력이 요구되는 **자료 구조**입니다.
<!--이미지-->

<br /><br />

* * *
<h2>2️⃣ 연결리스트 선언</h2>
<h3 align="middle" style="color:#0e435c;"> &lt; 연결리스트 선언의 기본적인 예시 &gt;</h3>
```c
typedef struct node 
{
    int value;
    node_t* next;
} node_t;
```
* **연결리스트**는 **구조체형태**로 선언합니다.
* 기본적으로 `value(데이터)`와 다음 노드의 주소를 저장할 `node_t *next(구조체 포인터)`로 구성 되어있습니다.

<br /><br />

* * *
<h2>3️⃣ 헤드 노드 선언</h2>
* **헤드 노드**는 **데이터**를 직접저장하지 않고 <b style="color:#dd1144;">첫 번째 노드를 가리키는 용도</b>입니다.
* 그렇다면 **첫 번째 노드**를 어떤식으로 가리킬지에 대한 의문이 생깁니다.
    <h3 align="left" style="color:#0e435c;">(1) head->next로 지정하는 방법</h3>
    ```c
    void first_node(node_t *phead, node_t *first_node)
    {
        phead->next = first_node;
    }

    int main(void)
    {
        node_t *head;
        head = (node_t)malloc(sizeof(node_t));
        head->next = NULL;  // 데이터는 저장하지 않음
        /* node1생성코드 생략 */
        first_node(head, node1);
    }
    ```
    <img src="https://kirkim.github.io/assets/img/c/linked_list_img1.jpg" alt="linked_list_img1" width="80%">

    * * *
    <h3 align="left" style="color:#0e435c;">(2) 첫번째노드 자체를 head로 지정하는 방법</h3>
    ```c
    void first_node(node_t **phead, node_t *first_node)
    {
        *phead = first_node;
    }

    int main(void)
    {
        node_t *head;
        head = NULL;
        /* node1생성코드 생략 */
        first_node(&head, node1);
    }
    ```
    <img src="https://kirkim.github.io/assets/img/c/linked_list_img2.jpg" alt="linked_list_img2" width="80%">
    이처럼 두가지의 방법이 있지만 **헤드노드**의 **동적할당문제**와 **가독성문제**를 생각해보면 **두번째 방법**이 더 좋을 것 같습니다. (상황에 따라서 잘 선택해서 사용하면 될 것 같습니다.)

<br /><br />

* * *
<h2>4️⃣ 연결리스트 추가</h2>
* 새로운 노드를 임의의 공간에 추가하는 것은 쉽지않습니다. 그렇기 때문에 <b style="color:#dd1144;">(1)맨앞에 노드추가</b>와 <b style="color:#dd1144;">(2)맨뒤에 노드추가</b>로 나눠서 구현해 보겠습니다.
    <h3 align="left" style="color:#0e435c;">(1) 맨앞에 노드를 추가하는 함수</h3>
    ```c
    void add_front_malloc(node_t **head, int val)
    {
        node_t *new_node;

        new_node = (node_t*)malloc(sizeof(node_t));
        new_node->value = val;

        new_node->next = *head;
        *head = new_node;
    }
    ```
    <img src="https://kirkim.github.io/assets/img/c/linked_list_img3.jpg" alt="linked_list_img3" width="100%">

    * * *
    <h3 align="left" style="color:#0e435c;">(2) 맨뒤에 노드를 추가하는 함수</h3>
    ```c
    void add_back_malloc(node_t **head, int val)
    {
        node_t *new_node;
        node_t *temp;

        temp = *head;
        new_node = (node_t*)malloc(sizeof(node_t));
        new_node->value = val;
        new_node->next = NULL;

        while(temp->next != NULL)
                temp = temp->next;
        temp->next = new_node;
    }
    ```
    <img src="https://kirkim.github.io/assets/img/c/linked_list_img4.jpg" alt="linked_list_img4" width="100%">
* **헤드노드**는 항상 첫번째 노드를 가리키고 있어야 하므로 **임시노드포인터(temp)**를 사용하는 것이 좋습니다.
* 함수 내부에서 **malloc함수**를 사용하기 때문에 함수명에 **_malloc**을 붙여줬습니다.

<br /><br />

* * *
<h2>5️⃣ 노드 삭제 및 연결리스트 해제</h2>
* **각노드**들은 **메모리 동적 할당**이 되어 있기 때문에 **메모리 누수(memory leak)**이 일어나지 않게 하기 위해서 사용한 후에 반드시 메모리해제가 필요합니다.
    <h3 align="left" style="color:#0e435c;"> (1) 특정 노드 삭제</h3>
    ```c
    void remove_node(node_t **head, int n)
    {
        node_t **temp;

        temp = head;
        while (*temp != NULL)
        {
            if ((*temp)->value == n)
            {
                node_t *temp2;
                temp2 = *temp;
                *temp = (*temp)->next;
                free(temp2);
                break;
            }
            temp = &(*temp)->next; //&((*temp)->next);
        }
    }
    ```
    <img src="https://kirkim.github.io/assets/img/c/linked_list_img5.jpg" alt="linked_list_img5" width="100%">
    * 위의 함수는 <b style="color:#dd1144;">특정 데이터(value)</b>값을 이용하여 **노드**를 찾은 뒤 삭제하고 **앞뒤 노드를 이어주는 함수**입니다.
    * 위의 함수를 사용하기 위해서는 **각각의 노드**를 구분할 수 있는 **데이터(value)**가 있어야 합니다.
    
    * * *
    <h3 align="left" style="color:#0e435c;"> (2) 전체 연결리스트 해제</h3>
    ```c
    void del_all_node(node_t* head)
    {
        node_t *temp;

        temp = head;
        while (temp != NULL)
        {
            node_t *nt;
            nt = temp->next;
            free(temp);
            temp = nt;
        }
    }
    ```
    * 위의 함수는 **전체 연결리스트**를 해제 시켜주는 함수 입니다. 연결 리스트사용이 끝나면 위와 같은 함수로 반드시 <b style="color:#dd1144;">메모리 해제</b>를 해줘야 합니다.

<br /><br />

* * *
<h2>6️⃣ 노드 출력 함수</h2>
* **전체 노드**의 **데이터**를 출력하는 함수를 구현해봤습니다.
    <h3 align="left" style="color:#0e435c;"> (1) 노드 출력 함수</h3>
    ```c
    void print_node(const node_t *head)
    {
        const node_t *temp;

        temp = head;
        while (temp != NULL)
        {
            printf("%d\n", temp->value);
            temp = temp->next;
        }
    }
    ```

    * * *
    <h3 align="left" style="color:#0e435c;"> (2) 간단한 main함수 구현</h3>
    ```c
    int main(void)
    {
        node_t *head;
        head = NULL;

        add_front_malloc(&head, 1);
        add_front_malloc(&head, 2);
        add_front_malloc(&head, 3);
        add_back_malloc(&head, 7);
        remove_node(&head, 2);
        print_node(head);
        del_all_node(head);

        return (0);
    }
    ```
    <kkr>
    <span style="color: #999988; font-style: italic;">/*---출력---*/</span><br />
    3<br />
    1<br />
    7
    </kkr>

<br /><br />

* * *
<h2>7️⃣ 기타</h2>
<h3 align="left" style="color:#0e435c;"> (1) 헤드노드를 받을때 왜 이중 포인터로 받을까?</h3>
* 위에서 헤드 선언법이 두가지로 나뉘었습니다. 그중 **첫번째**방법은 **헤드노드** 또한 **노드구조체로** 동적할당을 했고 **노드구조체의 next포인터**로 다음 첫 노드를 가리켰기 때문에 사실상 **이중포인터** 개념으로 주고 받을 수 있었습니다.
* 하지만 **두번째**방법으로 **헤드노드**자체를 지정할 경우 내부에 포인터 요소가 없기 때문에 ***head**포인터의 주소를 받기위해 **이중포인터**로 받아야 합니다.
* 결론적으로 **값**에의한 복사가 아닌 **참조형**으로 복사해야 합니다. 하지만 일반 포인터를 사용하면 **헤드 포인터**에 저장된 **주소**를 변경할 수 없습니다. 즉, **주소를 저장하는 포인터의 주소**를 받기위해 **이중포인터**로 받아와야 합니다.

* * *
<h3 align="left" style="color:#0e435c;"> (2) 연결 리스트의 용도<span style="font-size:70%;">(출처:pocu아카데미)</span></h3>
* **연결 리스트**는 **크기**를 미리 재한할 필요가 없고 **삽입/삭제**가 비교적 자유롭기 때문에 **배열**의 한계를 뛰어넘기위해 사용하던 자료구조입니다.
* 하지만 오늘날 어플리케이션 프로그램에서 사용빈도는 많이 줄었다고 합니다.
    * C#에서 **list**도 **연결리스트**가 아닌 **동적 할당 배열**입니다.
    * **최신 하드웨어**의 특징상 오히려 **배열**이 보장하는 훌륭한 메모리 지역성이 성능에 유리한 경우가 많습니다.
* 하지만 **커널 모드**프로그래밍(예: 드라이버)에서는 여전히 많이 사용합니다.
    * 메모리 지역성을 해치지 않으면서도 충분히 큰 메모리(예: 4kb)를 미리 할당하여사용
    * 필요에 따라 그 메모리를 쪼개 연결 리스트의 노드로 사용가능(예: 메모리 풀)