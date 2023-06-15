---
layout: post
title: '[Java] 생성자(constructor)'
subtitle: ''
date: 2021-05-14 03:45:51 +0900
categories: etc
tags: languages
comments: true
---

---

<h1>1️⃣ 생성자를 사용하는 이유</h1>
<h2 style="color:#0e435c;">(1) 생성자를 사용하지 않을 경우</h2>
<h3 align="middle" style="color:#0e435c;">&lt; 샘플코드(생성자사용x) &gt;</h3>

```java
public class main {
    public static void main(String[] argc) {
        Student person1 = new Student();
        person1.name = "kirim";
        person1.age = 29;s
    }
}

class Student {
    public String name;
    public int age;
}
```

- 멤버변수의 초기화를 위해 코드처럼 직접 값을 대입해야 합니다. 그렇기 때문에 멤버변수가 있었는지 까먹을 수 있어서 실수할 가능성이 커집니다.
- 또한 `Student`클래스의 <rd>멤버변수</rd>가 <rd>public</rd>으로 선언되어 있기 때문에 외부에서 참조가 가능해집니다.(멤버변수를 비밀로할 수 없음)

<h2 style="color:#0e435c;">(2) 생성자를 사용할 경우</h2>

- <b><rd>클래스의 멤버변수</rd></b>를 `protected`로 선언하여 사용할 수 있습니다.(멤버변수를 비밀로할 수 있음)
- 새로운 클래스의 인스턴스를 생성과 동시에 <b>유효한값</b>을 가질 수 있습니다.
- <b><rd>멤버변수 초기화를 강제</rd></b>하기때문에 실수할 가능성이 적습니다.
  <br /><br />

---

<h1>2️⃣ 생성자로 초기화하기</h1>
<h2 style="color:#0e435c;">(1) 생성자 기본초기화</h2>

- 생성자함수 함수명은 <rd>클래스명과 동일</rd>합니다.
- 생성자함수는 반환값이 없으며 반환형을 적어주지 않습니다.

```java
public class main {
    public static void main(String[] argc) {
        Student person1 = new Student("kirim", 29);
    }
}

class Student {
    protected String name;
    protected int age;

    public Student (String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

<h2 style="color:#0e435c;">(2) 다양한경우의수의 생성자생성</h2>

- 멤버변수가 2개이더라도 인자를 1개만 받아도 혹은 아이에 받지않아도 초기화되도록 만들어줄 수 있습니다.
<h3 align="middle" style="color:#0e435c;">&lt; Student클래스 부분 &gt;</h3>

```java
class Student {
    protected String name;
    protected int age;

    public Student (String name, int age) {
        this.name = name;
        this.age = age;
    }
    public Student (String name) {
        this.name = name;
    }
    public Student () {
    }
}
```

<h3 align="middle" style="color:#0e435c;">&lt; 사용 예시(main클래스) &gt;</h3>

```java
public class main {
    public static void main(String[] argc) {
        Student person1 = new Student("Mike", 25);
        Student person2 = new Student("Jane");
        Student person3 = new Student();
        System.out.println(person1.name);
        System.out.println(person2.name);
        System.out.println(person3.name);
    }
}
```

<kkr>
<rmk>/* 출력 */</rmk><br />
Mike<br />
Jane<br />
null<br />
</kkr>

<h2 style="color:#0e435c;">(3) 다른방법으로 생성자 초기화하기</h2>

- 멤버변수가 많아지면 다양한경우수의 <rd> 코드가 중복되는 경우</rd>가 많습니다.
- `this(인자1, 인자2, ...)`를 이용하여 기존의 생성자를 이용하여 초기화 시켜줄 수 있습니다.
<h3 align="middle" style="color:#0e435c;">&lt; Student클래스 부분 &gt;</h3>

```java
class Student {
    protected String name;
    protected int age;
    protected String city;

    /* 기본 생성자는 그대로 만들어줌 */
    public Student (String name, int age, String city) {
        this.name = name;
        this.age = age;
        this.city = city;
    }
    /* 기본 생성자를 이용해서 초기화시켜줌 */
    public Student (String name, int age) {
        this(name, age, null);
    }
    public Student (String name, String city) {
        this(name, 0, city);
    }
    public Student (String name) {
        this(name, 0, null);
    }
    public Student () {
        this(null, 0, null);
    }
}
```

<h3 align="middle" style="color:#0e435c;">&lt; 사용 예시(main클래스) &gt;</h3>

```java
public class main {
    public static void main(String[] argc) {
        Student person1 = new Student("Mike", 25);
        Student person2 = new Student("Jane");
        Student person3 = new Student("Kane", "seoul");
        Student person4 = new Student();
        System.out.println(person1.name + " " + person1.age + " " + person1.city);
        System.out.println(person2.name + " " + person2.age + " " + person2.city);
        System.out.println(person3.name + " " + person3.age + " " + person3.city);
        System.out.println(person4.name + " " + person4.age + " " + person4.city);
    }
}
```

<kkr>
<rmk>/* 출력 */</rmk><br />
Mike 25 null<br />
Jane 0 null<br />
Kane 0 seoul<br />
null 0 null<br />
</kkr>
