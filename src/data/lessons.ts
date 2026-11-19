import type { Lesson } from "../components/LessonList";

export interface LessonContent extends Lesson {
  code: string;
}

export const lessonsData: Record<string, LessonContent[]> = {
  javascript: [
    {
      id: "js-variables",
      title: "Variables",
      topic: "let, const and var",
      difficulty: "Beginner",
      code: `const username = "Rohit";
let age = 22;
var city = "Pune";

console.log(username);
console.log(age);
console.log(city);`,
    },
    {
      id: "js-conditionals",
      title: "Conditionals",
      topic: "if, else and conditions",
      difficulty: "Beginner",
      code: `const age = 20;

if (age >= 18) {
    console.log("You are an adult");
} else {
    console.log("You are a minor");
}`,
    },
    {
      id: "js-loops",
      title: "Loops",
      topic: "for and while loops",
      difficulty: "Beginner",
      code: `for (let i = 1; i <= 5; i++) {
    console.log("Number:", i);
}

let count = 1;

while (count <= 5) {
    console.log(count);
    count++;
}`,
    },
    {
      id: "js-functions",
      title: "Functions",
      topic: "Functions and return",
      difficulty: "Intermediate",
      code: `function makeChai(type) {
    return "Making " + type + " chai";
}

const serveChai = (cups) => {
    return "Serving " + cups + " cups";
};

console.log(makeChai("Masala"));
console.log(serveChai(3));`,
    },
    {
      id: "js-arrays",
      title: "Arrays",
      topic: "Array methods",
      difficulty: "Intermediate",
      code: `const fruits = ["Apple", "Mango", "Banana"];

fruits.push("Orange");

fruits.forEach((fruit) => {
    console.log(fruit);
});`,
    },
  ],

  python: [
    {
      id: "py-variables",
      title: "Variables",
      topic: "Variables and data types",
      difficulty: "Beginner",
      code: `name = "Rohit"
age = 22
city = "Pune"

print(name)
print(age)
print(city)`,
    },
    {
      id: "py-conditionals",
      title: "Conditionals",
      topic: "if, elif and else",
      difficulty: "Beginner",
      code: `age = 20

if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")`,
    },
    {
      id: "py-loops",
      title: "Loops",
      topic: "for and while loops",
      difficulty: "Beginner",
      code: `for i in range(1, 6):
    print("Number:", i)

count = 1

while count <= 5:
    print(count)
    count += 1`,
    },
    {
      id: "py-functions",
      title: "Functions",
      topic: "def, return, lambda",
      difficulty: "Intermediate",
      code: `def make_chai(type):
    return f"Making {type} chai"

serve_chai = lambda cups: f"Serving {cups} cups of chai"

print(make_chai("masala"))
print(serve_chai(3))`,
    },
    {
      id: "py-lists",
      title: "Lists",
      topic: "List operations",
      difficulty: "Intermediate",
      code: `fruits = ["Apple", "Mango", "Banana"]

fruits.append("Orange")

for fruit in fruits:
    print(fruit)

print(len(fruits))`,
    },
  ],

  cpp: [
    {
      id: "cpp-variables",
      title: "Variables",
      topic: "Data types and variables",
      difficulty: "Beginner",
      code: `#include <iostream>
using namespace std;

int main() {
    string name = "Rohit";
    int age = 22;

    cout << name << endl;
    cout << age << endl;

    return 0;
}`,
    },
    {
      id: "cpp-conditionals",
      title: "Conditionals",
      topic: "if and else",
      difficulty: "Beginner",
      code: `#include <iostream>
using namespace std;

int main() {
    int age = 20;

    if (age >= 18) {
        cout << "Adult";
    } else {
        cout << "Minor";
    }

    return 0;
}`,
    },
    {
      id: "cpp-loops",
      title: "Loops",
      topic: "for and while",
      difficulty: "Beginner",
      code: `#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 5; i++) {
        cout << i << endl;
    }

    return 0;
}`,
    },
    {
      id: "cpp-functions",
      title: "Functions",
      topic: "Functions and return",
      difficulty: "Intermediate",
      code: `#include <iostream>
using namespace std;

int add(int a, int b) {
    return a + b;
}

int main() {
    cout << add(10, 20);
    return 0;
}`,
    },
    {
      id: "cpp-arrays",
      title: "Arrays",
      topic: "Array traversal",
      difficulty: "Intermediate",
      code: `#include <iostream>
using namespace std;

int main() {
    int numbers[] = {10, 20, 30, 40};

    for (int i = 0; i < 4; i++) {
        cout << numbers[i] << endl;
    }

    return 0;
}`,
    },
  ],
};
