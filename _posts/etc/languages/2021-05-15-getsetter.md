---
layout: post
title: '[Java] getter, setter 메소드'
subtitle: ''
date: 2021-05-15 02:45:51 +0900
categories: etc
tags: languages
comments: true
---

---

<h1>1️⃣ getter, setter</h1>

- 왠만하면 <b>멤버변수</b>는 <rd>protected</rd>되어 있습니다.
- <b><rd>getter</rd></b>메소드를 이용하면 원하는 <b>멤버변수</b>의 정보를 얻을 수 있습니다.
- <b><rd>setter</rd></b>메소드를 이용하면 원하는 <b>멤버변수</b>의 값으로 세팅해줄 수 있습니다.
<h3 align="middle" style="color:#0e435c;">&lt; getter, setter 기본예시 &gt;</h3>

```java
public class main {
    public static void main(String[] argc) {
        member student1 = new member("Steve");
        System.out.println(student1.getName());
        student1.setName("Jane");
        System.out.println(student1.getName());
    }
}
class member {
    protected String name;

    public member(String name) {
        this.name = name;
    }
    public String getName() {
        return this.name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
```

<kkr>
<rmk>/* 출력 */</rmk><br />
Steve<br />
Jane<br />
</kkr>
<br /><br />

---

<h1>2️⃣ getter, setter 응용</h1>
<h2 style="color:#0e435c;">(1) getter활용</h2>

- 아래에서 기존 멤버변수를 이용해서 <rd>멤버변수로 저장할 필요없이</rd> 계산한 값을 출력하도록 만들어 줄 수 있습니다.

```java
class profile {
    protected int height;
    protected int weight;

    public profile(int height, int weight) {
        this.height = height;
        this.weight = weight;
    }
    public double getBMI() {
        return 10000 * this.weight / (this.height * this.height);
    }
}
```

<h2 style="color:#0e435c;">(2) setter활용1</h2>

- 특정조건일때만 입력을 받도록 만들어 줄 수 있습니다.

```java
public class main {
    public static void main(String[] argc) {
        profile student1 = new profile("Mike", 26);
        student1.setAge(111);
    }
}
class profile {

    /* 코드 생략 */

    public void setAge(int age) {
        if (age >= 1 && age <= 99)
            this.age = age;
        else
            System.out.printf("setAgeError: not allowed (age %d)", age);
    }
}
```

<kkr>
<rmk>/* 출력 */</rmk><br />
setAgeError: not allowed (age 111)<br />
</kkr>
<h2 style="color:#0e435c;">(3) setter활용2</h2>

- **getter**는 다소 자유롭게 사용해도 되지만 **setter**의 경우 값을 변경하는 것이기 때문에 아무 생각 없이 사용하면 위험할 수 있습니다.
- setter를 이용하여 **멤버변수**를 직접변경하는 것보다 **setter**를 이용하여 입력받은 값을 이용하여 <rd>객체 내부에서 알아서 멤버변수를 관리</rd>해주도록 사용하면 조금 안전하게(객체를 좀 더 의미있게?) 사용할 수 있을 것 같습니다.
- 아래의 코드예시는 <rd>score</rd>를 입력받으면 <rd>sum, mean</rd>값을 객체내부에서 관리하는 코드입니다.

```java
public class main {
    public static void main(String[] argc) {
        exam team1 = new exam(3); // 최대 인원수 3명으로 선언

        if (!team1.setScore(10))
            System.out.println("Error");
        System.out.println("sum: " + team1.sum + " " + "mean: " +  team1.mean);
        if (!team1.setScore(20))
            System.out.println("Error");
        System.out.println("sum: " + team1.sum + " " + "mean: " +  team1.mean);
        if (!team1.setScore(30))
            System.out.println("Error");
        System.out.println("sum: " + team1.sum + " " + "mean: " +  team1.mean);
        if (!team1.setScore(40))
            System.out.println("Error");
        System.out.println("sum: " + team1.sum + " " + "mean: " +  team1.mean);
    }
}
class exam {
    protected int index;
    protected int indexMax;
    protected int sum;
    protected int mean;
    protected int[] score;

    /* 최대인원수만큼 배열 초기화 */
    public exam(int maxPopulationMax) {
        this.score = new int[populationMax];
        this.indexMax = populationMax;
    }

    /* 점수만 추가 */
    public boolean setScore(int score) {
        if (score < 0 || this.index >= this.indexMax) {
            return false;
        } else {
            this.score[this.index] = score;
            updateSum(score);
            updateMean();
            index++;
            return true;
        }
    }

    /* sum과 mean은 객체가 알아서 관리 */
    protected void updateSum(int score) {
        this.sum += score;
    }
    protected void updateMean() {
        this.mean = this.sum / (this.index + 1);
    }
}
```

<kkr>
<rmk>/* 출력 */</rmk><br />
sum: 10 mean: 10<br />
sum: 30 mean: 15<br />
sum: 60 mean: 20<br />
Error<br />
sum: 60 mean: 20<br />
</kkr>

<br><br>

---

<h1>3️⃣ 고찰</h1>

- **setter**를 사용할바에 **멤버변수 자체를 public**으로 만들면 되지 않을까 생각할 수 있지만 객체지향의 기준으로 생각해본다면 **객체자체가 자기자신을 관리하는 것**이 더 올바르기 때문에 **setter**를 사용하는 것이 **캡슐화**적으로도 맞다고 생각합니다. 또한 위의 예시처럼 **getter, setter**를 만들어 활용할 수 있습니다.
- 하지만 완벽한 캡슐화를 위해서는 되도록 **setter**는 고민하고 삽입하는 것이 좋을 것 같다고 생각합니다.
- **getter**는 마음대로 삽입해도 된다고 생각합니다. 하지만 <rd>immutable(불변) 클래스</rd>를 제외한 클래스의 getter사용도 조심해야됩니다.
<h2 align="middle" style="color:#0e435c;">&lt; 안좋은 getter예시 &gt;</h2>

```java
public static void main(String[] args) {
    Test test = new Test();
    ArrayList<Integer> sample = new ArrayList<>();

    sample = test.getIntegers; // getter로 ArrayList개체를 받음
    sample.add(3);      // 수정이 가능하다.
}
```

- 위처럼 **클래스**를 반환하는 getter를 만들경우 수정이가능하기 때문에 잘 사용 해야 합니다.<b style="font-size:85%"(단, **String**은 **immutable클래스**이기 때문에 가능하다.)</b>
