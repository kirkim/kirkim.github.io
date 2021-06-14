---
layout: post
title:  "[libft](3)리스트 함수"
subtitle:   ""
date: 2021-02-25 03:45:51 +0900
categories: 42seoul
tags: libft
comments: true
---

이번 포스트는 **libft**에 내장할 리스트(list)함수에 관한 내용입니다.

* * *
<h2> libft.h파일에 리스트함수에 사용될 구조체 선언 </h2>
```c
typedef struct	s_list
{
	void		*content;
	struct s_list	*next;
}			t_list;
```
* 연결 리스트의 노드는 구조체의 형태를 띠고 있습니다.
* 노드 구조체를 `t_list`라고 자료형 이름을 지정하였습니다.
* `void *cotent;`는 각 노드가 저장할 **데이터요소**입니다.
* `struct s_list *next;`는 **다음 노드의 주소를 저장할 포인터**로 이 포인터가 각노드의 연결고리 역할을 하게 됩니다.

<h4><span style="color:#084B8A;">자세한내용 &gt;</span><a href="https://kirkim.github.io/c/2021/03/04/linked_list.html" target="blank">[C]연결리스트(linked list)</a></h4>

* * *
<h2> 1️⃣lstnew </h2>
* **lstnew함수**는 **첫 노드를 생성**하는 함수입니다.

<h4 align="middle">&#60; 함수구현 &#62;</h4>
```c
t_list *ft_lstnew(void *content)
{
	t_list	*result;

	if (!(result = (t_list *)malloc(sizeof(t_list))))
		return (0);
	result->content = content;
	result->next = NULL;
	return (result);
}
```

* * *
<h2> 2️⃣ lstadd_front</h2>
* **lstadd_front함수**는 **앞쪽에 새로운 노드를 추가**하는 함수입니다.

<h4 align="middle">&#60; 함수구현 &#62;</h4>
```c
void ft_lstadd_front(t_list **lst, t_list *new)
{
	new->next = *lst;
	*lst = new;
}
```

* * *
<h2> 3️⃣ lstadd_back</h2>
* **lstadd_back함수**는 **뒤쪽에 새로운 노드를 추가**하는 함수입니다.

<h4 align="middle">&#60; 함수구현 &#62;</h4>
```c
void ft_lstadd_back(t_list **lst, t_list *new)
{
	if (*lst == 0)
		*lst = new;
	else
		(ft_lstlast(*lst))->next = new;
}
```

* * *
<h2> 4️⃣ lstsize</h2>
* **lstsize함수**는 **노드의 갯수**를 새어주는 함수입니다.

<h4 align="middle">&#60; 함수구현 &#62;</h4>
```c
int ft_lstsize(t_list *lst)
{
	size_t size;

	size = 0;
	while (lst)
	{
		lst = lst->next;
		size++;
	}
	return (size);
}
```

* * *
<h2> 5️⃣ lstlast</h2>
* **lstlast함수**는 **마지막 노드의 주소**를 출력해주는 함수입니다.

<h4 align="middle">&#60; 함수구현 &#62;</h4>
```c
t_list *ft_lstlast(t_list *lst)
{
	if (!lst)
		return (0);
	while (lst->next)
		lst = lst->next;
	return (lst);
}
```

* * *
<h2> 6️⃣ lstiter</h2>
* **lstiter함수**는 노드의 모든 **요소**에 *지정한 함수**를 적용시키는 함수입니다.

<h4 align="middle">&#60; 함수구현 &#62;</h4>
```c
void ft_lstiter(t_list *lst, void (*f)(void *))
{
	while (lst)
	{
		f(lst->content);
		lst = lst->next;
	}
}
```

* * *
<h2> 7️⃣ lstdelone</h2>
* **lstdelone함수**는 **특정 노드를 삭제**하는 함수입니다.

<h4 align="middle">&#60; 함수구현 &#62;</h4>
```c
void ft_lstdelone(t_list *lst, void (*del)(void *))
{
	del(lst->content);
	free(lst);
}
```

* * *
<h2> 8️⃣ lstclear</h2>
* **lstclear함수**는 **모든 노드를 삭제**하는 함수 입니다.

<h4 align="middle">&#60; 함수구현 &#62;</h4>
```c
void ft_lstclear(t_list **lst, void (*del)(void *))
{
	t_list	*tmp;

	while (*lst)
	{
		tmp = (*lst)->next;
		del((*lst)->content);
		free(*lst);
		*lst = tmp;
	}
	*lst = 0;
}
```

* * *
<h2> 9️⃣ lstmap</h2>
* **lstmap함수**는 연결리스트의 **노드요소**들을 **지정한 함수**를 적용하여 **새로운 리스트와 노드에 복사**하는 함수입니다.

<h4 align="middle">&#60; 함수구현 &#62;</h4>
```c
t_list *ft_lstmap(t_list *lst, void *(*f)(void *), void (*del)(void *))
{
	t_list	*result;
	t_list	*curr;

	if (!lst || !f || !(result = ft_lstnew(f(lst->content))))
		return (0);
	curr = result;
	lst = lst->next;
	while (lst)
	{
		if (!(curr->next = ft_lstnew(f(lst->content))))
		{
			ft_lstclear(&result, del);
			return (0);
		}
		curr = curr->next;
		lst = lst->next;
	}
	return (result);
}
```

* * *
<br /><br />
<h2><span style="color:#084B8A;">이전포스트 &gt;</span><a href="https://kirkim.github.io/42seoul/2021/02/24/libft_func.html" target="blank"> [libft](2)내장함수 구현</a></h2>
<h2><span style="color:#084B8A;">다음포스트 &gt;</span><a href="https://kirkim.github.io/42seoul/2021/02/25/libft_makefile.html" target="blank"> [libft](4)Makefile</a></h2>