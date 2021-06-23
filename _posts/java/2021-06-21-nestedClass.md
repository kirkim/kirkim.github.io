---
layout: post
title:  "[Java] 내포클래스(Nested Class)"
subtitle:   ""
date: 2021-06-21 02:45:51 +0900
categories: java
tags: etc
comments: true
---

* * *
## 1️⃣ 내포 클래스(Nested Class)

* 자바에는 내포 클래스를 크게 **두가지**로 나눌 수 있습니다.
    1. 비정적 내포 클래스(non-static nested class)
    2. 정적 내포 클래스(static nested class)
* **Java**를 제외한 대부분의 다른 언어들은 **정적 내포 클래스**만을 지원합니다. **비정저 내포 클래스**는 **Java**에만 존재하는 개념이라고할 수 있습니다.
* 내포 클래스를 이용하면 **연관된 클래스**들끼리 **그룹화**를 할 수 있습니다.
* 내포 클래스는 외부클래스의 **private**제어자로된 멤버변수에도 접근이 가능합니다.
<br><br>

* * *
## 2️⃣ 내포클래스를 사용하지 않을 때
* **내포클래스**의 예시로 **상속**관계에 있는 것보다 **컴포지션인 (has-a)**관계에 있는 클래스들을 이용하겠습니다.
* **Mouse클래스**를 가지는 **Computer클래스**의 예시입니다.
<br>
* 먼저 **내포클래스를 이용하지않고 구현**했을 때 입니다.

```java
/* Computer */
public class Computer {
    private Mouse mouse;

    public Computer(Mouse mouse) {
        this.mouse = mouse;
    }
}
/* Mouse */
public class Mouse {
    private int x;
    private int y;

    public void moveXY(int x, int y) {
        this.x = x;
        this.y = y;
    }
}
```
<br><br>

* * *
## 3️⃣ 비정적내포클래스(non-static nested class)를 이용할 떄

<h3 style="color:#0e435c;">(1) 비정적내포클래스로 구현했을 때</h3>

```java
public class Computer {
    private int x;
    private int y;

    public class Mouse {
        public void moveXY(int X, int Y) {
            this.x = X; // 컴파일 에러
            x = X;     // 올바른 접근방법
            y = Y;
        }
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }
}
```

* **내포클래스**에서 외부의 `private`접근제어자를 사용한 멤버변수에 접근이 가능함을 보여주기 위해 <rd>x, y</rd>멤버변수를 외부에 배치하였습니다.
* 또하나 특이한점은 **내포클래스**안에 존재하는 `moveXY`메소드를 보면 외부의 x멤버변수에 접근할 때 `this`를 이용하여 접근하면 컴파일에러가 일어납니다. <b style="font-size:85%">(상속관계에서 **자식클래스**가 **부모클래스**의 멤버변수에 접근할때 <rd>super. 대신에 this.</rd>를 사용할 수 있었던 것과 대조됩니다.)</b>
<br>
<h3 style="color:#0e435c;">(2) 비정적내포클래스를 사용하기</h3>

* 위에서 구현한 **비정적내포클래스**를 생성하여 사용하는 방법입니다.

```java
public class main {
    public static void main(String[] argc) {
        Computer com = new Computer();
        Computer.Mouse mouse = com.new Mouse();
    }
}
```

* 기존에 `new`를 이용하여 생성했던 것과 달리 `com.new`와 같이 다소 상식과 벗어난듯한 모습을 보이는 생성방법입니다.
<br><br>

* * *
## 4️⃣ 정적내포클래스(static nested class)를 이용할 떄

<h3 style="color:#0e435c;">(1) 정적내포클래스로 구현했을 때</h3>

```java
public class Computer {
    private int x;
    private int y;

    public static class Mouse {
        Computer computer;
        
        public Mouse(Computer computer){
            this.computer = computer;
        }
        public void moveXY(int X, int Y) {
            computer.x = X;
            computer.y = Y;
        }
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }
}
```

* **정적내포클래스**라는 이름 그대로 내포클래스에 <rd>static키워드</rd>를 붙여서 구현합니다.
* 여기서 <rd>static키워드</rd>의 쓰임은 기존에 알고 있던 쓰임과는 약간 다릅니다. <b style="font-size:85%">(단순히 외부클래스의 것들에 접근하지 않기위함, 이러한 점에서 외부클래스의 `private멤버변수`가 OOP의 캡슐화 관점에서보면 다시 제 기능을 할 수있어집니다.)</b>
<br>
<h3 style="color:#0e435c;">(2) 정적내포클래스를 사용하기</h3>

* 위에서 구현한 **정적내포클래스**를 생성하여 사용하는 방법입니다.

```java
public class main {
    public static void main(String[] argc) {
        Computer com = new Computer();
        Computer.Mouse mouse = new Computer.Mouse(com);
    }
}
```

* **비정적내포클래스**를 사용하는 것보다 좀 더 상식적인 방법으로 바뀐 것같습니다.
<br><br>

* * *
## 5️⃣ 끝맞치며..

* 내포클래스를 이용하면 서로 연관된 클래스끼리 그룹화를 지을 수 있습니다. 또한 `private`나 `protected`접근제어자를 클래스에 붙여서 사용할 수있습니다.(다양한 목적으로 사용가능)
* 그러나 요즘에는 <rd>파일하나에 클래스하나</rd>의 원칙으로 사용하는 경우가 더 많은 것 같습니다.