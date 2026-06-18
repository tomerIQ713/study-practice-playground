const SKELETON =
  'using System;\n' +
  '\n' +
  'class Program {\n' +
  '    static void Main(string[] args) {\n' +
  '        \n' +
  '    }\n' +
  '}'

const SKELETON_COLL =
  'using System;\n' +
  'using System.Collections.Generic;\n' +
  '\n' +
  'class Program {\n' +
  '    static void Main(string[] args) {\n' +
  '        \n' +
  '    }\n' +
  '}'

const SKELETON_COLL_LINQ =
  'using System;\n' +
  'using System.Collections.Generic;\n' +
  'using System.Linq;\n' +
  '\n' +
  'class Program {\n' +
  '    static void Main(string[] args) {\n' +
  '        \n' +
  '    }\n' +
  '}'

const SKELETON_IO =
  'using System;\n' +
  'using System.IO;\n' +
  '\n' +
  'class Program {\n' +
  '    static void Main(string[] args) {\n' +
  '        \n' +
  '    }\n' +
  '}'

const SKELETON_METHOD =
  'using System;\n' +
  '\n' +
  'class Program {\n' +
  '    static void Main(string[] args) {\n' +
  '        \n' +
  '    }\n' +
  '}'

export const TOPICS = [
  {
    id: 1,
    title: 'Variables',
    exercises: [
      {
        id: 1,
        topicExerciseNum: 1,
        title: 'Declare and print an int',
        description: 'Declare an `int` variable, assign it the value `42`, and print it using `Console.WriteLine`.',
        skeleton: SKELETON,
        concept:
          '<strong>Variables</strong> store data in memory.<br><br>' +
          '<strong>Declaration:</strong><br>' +
          '<code>int x;</code> — declares an integer variable named x<br>' +
          '<code>int x = 42;</code> — declares and initializes<br><br>' +
          '<strong>Printing:</strong><br>' +
          '<code>Console.WriteLine(x);</code> — prints the value of x followed by a new line.<br><br>' +
          'All C# programs need <code>using System;</code> at the top.',
        hints: [
          'What keyword declares a whole-number variable in C#?',
          'How do you assign a value at declaration time?',
          'Which method prints a value followed by a new line?',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        int x = 42;\n' +
          '        Console.WriteLine(x);\n' +
          '    }\n' +
          '}',
        expectedOutput: '42\n',
      },
      {
        id: 2,
        topicExerciseNum: 2,
        title: 'Concatenate string and int',
        description: 'Declare a `string` and an `int`, concatenate them into a sentence, and print the result using `Console.WriteLine`.',
        skeleton: SKELETON,
        concept:
          '<strong>String concatenation</strong> joins multiple values into one string.<br><br>' +
          '<code>string name = "Alice";</code><br>' +
          '<code>int age = 30;</code><br>' +
          '<code>Console.WriteLine(name + " is " + age);</code><br><br>' +
          'The <code>+</code> operator converts non-string values to strings automatically.',
        hints: [
          'Declare a string variable with quotes.',
          'Declare an int variable with a number.',
          'Use + to join text and variables inside Console.WriteLine.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        string name = "Alice";\n' +
          '        int age = 30;\n' +
          '        Console.WriteLine(name + " is " + age + " years old.");\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Alice is 30 years old.\n',
      },
      {
        id: 3,
        topicExerciseNum: 3,
        title: 'Double vs float precision',
        description: 'Declare a `double` and a `float`, print both, and observe the difference in precision.',
        skeleton: SKELETON,
        concept:
          '<strong>float</strong> (32-bit) and <strong>double</strong> (64-bit) store real numbers with different precision.<br><br>' +
          '<code>float f = 3.1415926535f;</code> — note the <code>f</code> suffix<br>' +
          '<code>double d = 3.1415926535;</code><br><br>' +
          'float has ~7 decimal digits of precision, double has ~15-16.',
        hints: [
          'Add the f suffix to float literals.',
          'Print both variables to see rounding differences.',
          'Use format strings or just WriteLine to see the full values.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        float f = 3.1415926535f;\n' +
          '        double d = 3.1415926535;\n' +
          '        Console.WriteLine("float: " + f);\n' +
          '        Console.WriteLine("double: " + d);\n' +
          '    }\n' +
          '}',
        expectedOutput: 'float: 3.1415927\ndouble: 3.1415926535\n',
      },
      {
        id: 4,
        topicExerciseNum: 4,
        title: 'Implicitly typed variables with var',
        description: 'Use `var` to declare three variables of different types. Print each with its type using `GetType()`.',
        skeleton: SKELETON,
        concept:
          '<strong>var</strong> infers the type at compile time.<br><br>' +
          '<code>var x = 42;</code> — x is int<br>' +
          '<code>var name = "Alice";</code> — name is string<br>' +
          '<code>var pi = 3.14;</code> — pi is double<br><br>' +
          'Use <code>variable.GetType()</code> to get the runtime type.',
        hints: [
          'Declare variables without specifying the type — use var instead.',
          'Assign different types of values (int, string, double).',
          'Call .GetType() on each variable inside WriteLine.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        var x = 42;\n' +
          '        var name = "Alice";\n' +
          '        var pi = 3.14;\n' +
          '        Console.WriteLine(x + " is " + x.GetType());\n' +
          '        Console.WriteLine(name + " is " + name.GetType());\n' +
          '        Console.WriteLine(pi + " is " + pi.GetType());\n' +
          '    }\n' +
          '}',
        expectedOutput: '42 is System.Int32\nAlice is System.String\n3.14 is System.Double\n',
      },
      {
        id: 5,
        topicExerciseNum: 5,
        title: 'Constants with const',
        description: 'Declare a `const double PI = 3.14159;`, try to reassign it in a comment, and observe the compiler error.',
        skeleton: SKELETON,
        concept:
          '<strong>const</strong> declares a compile-time constant.<br><br>' +
          '<code>const double PI = 3.14159;</code><br><br>' +
          'Constants cannot be reassigned after declaration. Attempting <code>PI = 3;</code> causes a compiler error.<br><br>' +
          'Write the reassign attempt in a <code>// comment</code> so the code compiles.',
        hints: [
          'Use the const keyword before the type.',
          'Print PI to show it works.',
          'Add a comment showing what would happen if you tried to reassign PI.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        const double PI = 3.14159;\n' +
          '        Console.WriteLine("PI = " + PI);\n' +
          '        // PI = 3;  // Error: A const field cannot be assigned to\n' +
          '    }\n' +
          '}',
        expectedOutput: 'PI = 3.14159\n',
      },
    ],
  },
  {
    id: 2,
    title: 'Operators',
    exercises: [
      {
        id: 6,
        topicExerciseNum: 1,
        title: 'Arithmetic operations',
        description: 'Write a program that prints the sum, difference, product, quotient, and remainder of two numbers.',
        skeleton: SKELETON,
        concept:
          '<strong>Arithmetic operators:</strong><br>' +
          '<code>+</code> addition<br>' +
          '<code>-</code> subtraction<br>' +
          '<code>*</code> multiplication<br>' +
          '<code>/</code> division<br>' +
          '<code>%</code> remainder (modulo)<br><br>' +
          'Integer division truncates toward zero. Use double for fractional results.',
        hints: [
          'Declare two int variables with values.',
          'Use +, -, *, /, and % between them.',
          'Print each result with Console.WriteLine.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        int a = 17, b = 5;\n' +
          '        Console.WriteLine("Sum: " + (a + b));\n' +
          '        Console.WriteLine("Diff: " + (a - b));\n' +
          '        Console.WriteLine("Prod: " + (a * b));\n' +
          '        Console.WriteLine("Quot: " + (a / b));\n' +
          '        Console.WriteLine("Rem: " + (a % b));\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Sum: 22\nDiff: 12\nProd: 85\nQuot: 3\nRem: 2\n',
      },
      {
        id: 7,
        topicExerciseNum: 2,
        title: 'Celsius to Fahrenheit',
        description: 'Convert a temperature from Celsius to Fahrenheit using `F = C * 9.0 / 5 + 32`. Print both.',
        skeleton: SKELETON,
        concept:
          '<strong>Temperature conversion:</strong><br>' +
          '<code>double f = c * 9.0 / 5 + 32;</code><br><br>' +
          'Using <code>9.0</code> instead of <code>9</code> forces floating-point division.',
        hints: [
          'Declare a double for Celsius.',
          'Use the formula with 9.0 to avoid integer division.',
          'Print both Celsius and Fahrenheit values.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        double c = 25.0;\n' +
          '        double f = c * 9.0 / 5 + 32;\n' +
          '        Console.WriteLine(c + "°C = " + f + "°F");\n' +
          '    }\n' +
          '}',
        expectedOutput: '25°C = 77°F\n',
      },
      {
        id: 8,
        topicExerciseNum: 3,
        title: 'Ternary operator even/odd',
        description: 'Use the ternary operator to print "even" or "odd" for a given number.',
        skeleton: SKELETON,
        concept:
          '<strong>Ternary operator:</strong> <code>condition ? valueIfTrue : valueIfFalse</code><br><br>' +
          '<code>Console.WriteLine(x % 2 == 0 ? "even" : "odd");</code><br><br>' +
          'The <code>%</code> operator gives the remainder — if divisible by 2, the number is even.',
        hints: [
          'Use % 2 to check divisibility.',
          'The condition should compare x % 2 with 0.',
          'Use the ternary operator inside Console.WriteLine.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        int x = 7;\n' +
          '        Console.WriteLine(x % 2 == 0 ? "even" : "odd");\n' +
          '    }\n' +
          '}',
        expectedOutput: 'odd\n',
      },
      {
        id: 9,
        topicExerciseNum: 4,
        title: 'Compound assignment',
        description: 'Use compound assignment operators `+=`, `-=`, `*=`, `/=` on a variable and print after each step.',
        skeleton: SKELETON,
        concept:
          '<strong>Compound assignment</strong> combines an operator with assignment:<br>' +
          '<code>x += 5</code> is equivalent to <code>x = x + 5</code><br>' +
          '<code>x -= 3</code> is equivalent to <code>x = x - 3</code><br>' +
          '<code>x *= 2</code> is equivalent to <code>x = x * 2</code><br>' +
          '<code>x /= 4</code> is equivalent to <code>x = x / 4</code>',
        hints: [
          'Start with an int variable.',
          'Apply +=, then print. Then -=, print. Then *=, print. Then /=, print.',
          'Watch the value change after each step.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        int x = 20;\n' +
          '        x += 5; Console.WriteLine("+=5: " + x);\n' +
          '        x -= 3; Console.WriteLine("-=3: " + x);\n' +
          '        x *= 2; Console.WriteLine("*=2: " + x);\n' +
          '        x /= 4; Console.WriteLine("/=4: " + x);\n' +
          '    }\n' +
          '}',
        expectedOutput: '+=5: 25\n-=3: 22\n*=2: 44\n/=4: 11\n',
      },
      {
        id: 10,
        topicExerciseNum: 5,
        title: 'Null coalescing operator',
        description: 'Use the null coalescing operator `??` to print a fallback value when a string variable is null.',
        skeleton: SKELETON,
        concept:
          '<strong>Null coalescing operator</strong> <code>??</code> returns the left operand if not null, otherwise the right operand.<br><br>' +
          '<code>string name = null;</code><br>' +
          '<code>Console.WriteLine(name ?? "default");</code> — prints "default"<br><br>' +
          'Also try: <code>Console.WriteLine(name?.Length ?? 0);</code> — null-conditional operator.',
        hints: [
          'Declare a string variable and assign it null.',
          'Use ?? to provide a fallback when printing.',
          'Also try with a non-null value to see the difference.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        string name = null;\n' +
          '        Console.WriteLine(name ?? "Fallback: name was null");\n' +
          '        name = "Alice";\n' +
          '        Console.WriteLine(name ?? "Fallback");\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Fallback: name was null\nAlice\n',
      },
    ],
  },
  {
    id: 3,
    title: 'Control Flow',
    exercises: [
      {
        id: 11,
        topicExerciseNum: 1,
        title: 'Letter grade with if/else if',
        description: 'Read a score (0-100) and print A, B, C, D, or F using if/else if.',
        skeleton: SKELETON,
        concept:
          '<strong>if / else if</strong> chains multiple conditions:<br><br>' +
          '<code>if (score >= 90) grade = "A";</code><br>' +
          '<code>else if (score >= 80) grade = "B";</code><br>' +
          '<code>else if (score >= 70) grade = "C";</code><br>' +
          '<code>else if (score >= 60) grade = "D";</code><br>' +
          '<code>else grade = "F";</code>',
        hints: [
          'Start from the highest grade and work down.',
          'Use int score with a hard-coded value.',
          'Use else if for each subsequent condition.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        int score = 85;\n' +
          '        string grade;\n' +
          '        if (score >= 90) grade = "A";\n' +
          '        else if (score >= 80) grade = "B";\n' +
          '        else if (score >= 70) grade = "C";\n' +
          '        else if (score >= 60) grade = "D";\n' +
          '        else grade = "F";\n' +
          '        Console.WriteLine("Score " + score + " = " + grade);\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Score 85 = B\n',
      },
      {
        id: 12,
        topicExerciseNum: 2,
        title: 'FizzBuzz',
        description: 'Print numbers 1-50. Replace multiples of 3 with "Fizz", 5 with "Buzz", both with "FizzBuzz".',
        skeleton: SKELETON,
        concept:
          '<strong>FizzBuzz</strong> is a classic programming problem:<br><br>' +
          'For i from 1 to 50:<br>' +
          '  if i % 3 == 0 and i % 5 == 0 → "FizzBuzz"<br>' +
          '  else if i % 3 == 0 → "Fizz"<br>' +
          '  else if i % 5 == 0 → "Buzz"<br>' +
          '  else → i<br><br>' +
          'Check the most specific condition (both) first.',
        hints: [
          'Use a for loop from 1 to 50.',
          'Check i % 3 == 0 && i % 5 == 0 first.',
          'Use Console.WriteLine inside the loop.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        for (int i = 1; i <= 50; i++) {\n' +
          '            if (i % 3 == 0 && i % 5 == 0) Console.WriteLine("FizzBuzz");\n' +
          '            else if (i % 3 == 0) Console.WriteLine("Fizz");\n' +
          '            else if (i % 5 == 0) Console.WriteLine("Buzz");\n' +
          '            else Console.WriteLine(i);\n' +
          '        }\n' +
          '    }\n' +
          '}',
        expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz\nFizz\n22\n23\nFizz\nBuzz\n26\nFizz\n28\n29\nFizzBuzz\n31\n32\nFizz\n34\nBuzz\nFizz\n37\n38\nFizz\nBuzz\n41\nFizz\n43\n44\nFizzBuzz\n46\n47\nFizz\n49\nBuzz\n',
      },
      {
        id: 13,
        topicExerciseNum: 3,
        title: 'Switch expression for day names',
        description: 'Use a switch expression to map a day number (1-7) to its name and print it.',
        skeleton: SKELETON,
        concept:
          '<strong>Switch expressions</strong> are concise:<br><br>' +
          '<code>string name = day switch {</code><br>' +
          '  <code>1 => "Monday",</code><br>' +
          '  <code>2 => "Tuesday",</code><br>' +
          '  <code>...</code><br>' +
          '  <code>_ => "Invalid"</code><br>' +
          '<code>};</code><br><br>' +
          'The <code>_</code> discard pattern handles all other values.',
        hints: [
          'Use the switch expression syntax: variable switch { patterns }.',
          'Use the _ discard for the default case.',
          'Print the result of the switch expression.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        int day = 4;\n' +
          '        string name = day switch {\n' +
          '            1 => "Monday",\n' +
          '            2 => "Tuesday",\n' +
          '            3 => "Wednesday",\n' +
          '            4 => "Thursday",\n' +
          '            5 => "Friday",\n' +
          '            6 => "Saturday",\n' +
          '            7 => "Sunday",\n' +
          '            _ => "Invalid day",\n' +
          '        };\n' +
          '        Console.WriteLine(name);\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Thursday\n',
      },
      {
        id: 14,
        topicExerciseNum: 4,
        title: 'Multiplication table',
        description: 'Use nested for loops to print a 10x10 multiplication table.',
        skeleton: SKELETON,
        concept:
          '<strong>Nested loops</strong>: a loop inside another loop.<br><br>' +
          '<code>for (int i = 1; i <= 10; i++) {</code><br>' +
          '  <code>for (int j = 1; j <= 10; j++) {</code><br>' +
          '    <code>Console.Write((i * j).ToString().PadLeft(4));</code><br>' +
          '  <code>}</code><br>' +
          '  <code>Console.WriteLine();</code><br>' +
          '<code>}</code>',
        hints: [
          'The outer loop goes row by row (1 to 10).',
          'The inner loop goes column by column (1 to 10).',
          'Print i * j with formatting, then a newline after each row.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        for (int i = 1; i <= 10; i++) {\n' +
          '            for (int j = 1; j <= 10; j++) {\n' +
          '                Console.Write((i * j).ToString().PadLeft(4));\n' +
          '            }\n' +
          '            Console.WriteLine();\n' +
          '        }\n' +
          '    }\n' +
          '}',
        expectedOutput: '   1   2   3   4   5   6   7   8   9  10\n   2   4   6   8  10  12  14  16  18  20\n   3   6   9  12  15  18  21  24  27  30\n   4   8  12  16  20  24  28  32  36  40\n   5  10  15  20  25  30  35  40  45  50\n   6  12  18  24  30  36  42  48  54  60\n   7  14  21  28  35  42  49  56  63  70\n   8  16  24  32  40  48  56  64  72  80\n   9  18  27  36  45  54  63  72  81  90\n  10  20  30  40  50  60  70  80  90 100\n',
      },
      {
        id: 15,
        topicExerciseNum: 5,
        title: 'Collatz sequence',
        description: 'Start from a user-given n. If even divide by 2, if odd multiply by 3 and add 1. Loop until n == 1.',
        skeleton: SKELETON,
        concept:
          '<strong>Collatz conjecture</strong>:<br>' +
          'For any positive integer n:<br>' +
          '  If n is even → n = n / 2<br>' +
          '  If n is odd → n = 3 * n + 1<br>' +
          'Repeat until n == 1.<br><br>' +
          'Use a <code>while</code> loop: <code>while (n != 1)</code>',
        hints: [
          'Use a while loop that runs as long as n != 1.',
          'Use if/else inside the loop to check even/odd.',
          'Use n % 2 == 0 to check if even.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        int n = 13;\n' +
          '        while (n != 1) {\n' +
          '            Console.WriteLine(n);\n' +
          '            if (n % 2 == 0) n /= 2;\n' +
          '        else n = 3 * n + 1;\n' +
          '        }\n' +
          '        Console.WriteLine(n);\n' +
          '    }\n' +
          '}',
        expectedOutput: '13\n40\n20\n10\n5\n16\n8\n4\n2\n1\n',
      },
    ],
  },
  {
    id: 4,
    title: 'Methods',
    exercises: [
      {
        id: 16,
        topicExerciseNum: 1,
        title: 'Square method',
        description: 'Write a method `int Square(int n)` that returns the square of a number and print the result.',
        skeleton: SKELETON_METHOD,
        concept:
          '<strong>Methods</strong> encapsulate reusable logic.<br><br>' +
          '<code>static int Square(int n) {</code><br>' +
          '  <code>return n * n;</code><br>' +
          '<code>}</code><br><br>' +
          '<code>static</code> means the method belongs to the class, not an instance.<br>' +
          'Call it with <code>Square(5)</code> from Main.',
        hints: [
          'Add the method inside the class but outside Main.',
          'Use return n * n to compute the square.',
          'Call Square from Main and print the result.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static int Square(int n) {\n' +
          '        return n * n;\n' +
          '    }\n' +
          '\n' +
          '    static void Main(string[] args) {\n' +
          '        Console.WriteLine(Square(7));\n' +
          '    }\n' +
          '}',
        expectedOutput: '49\n',
      },
      {
        id: 17,
        topicExerciseNum: 2,
        title: 'Prime checker',
        description: 'Write a method `bool IsPrime(int n)` that returns true if a number is prime, false otherwise.',
        skeleton: SKELETON_METHOD,
        concept:
          '<strong>Prime numbers</strong> are greater than 1 and divisible only by 1 and themselves.<br><br>' +
          'Check divisors from 2 up to sqrt(n):<br>' +
          '<code>for (int i = 2; i * i <= n; i++)</code><br>' +
          '  <code>if (n % i == 0) return false;</code><br>' +
          '<code>return n > 1;</code>',
        hints: [
          'Handle numbers <= 1: they are not prime.',
          'Use a for loop up to sqrt(n) — compare i * i <= n.',
          'Return false if any divisor is found, true otherwise.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static bool IsPrime(int n) {\n' +
          '        if (n <= 1) return false;\n' +
          '        for (int i = 2; i * i <= n; i++) {\n' +
          '            if (n % i == 0) return false;\n' +
          '        }\n' +
          '        return true;\n' +
          '    }\n' +
          '\n' +
          '    static void Main(string[] args) {\n' +
          '        Console.WriteLine(IsPrime(17));\n' +
          '        Console.WriteLine(IsPrime(20));\n' +
          '    }\n' +
          '}',
        expectedOutput: 'True\nFalse\n',
      },
      {
        id: 18,
        topicExerciseNum: 3,
        title: 'Recursive factorial',
        description: 'Write a recursive method `int Factorial(int n)` and test it for values 0-10.',
        skeleton: SKELETON_METHOD,
        concept:
          '<strong>Recursion</strong>: a method that calls itself.<br><br>' +
          '<code>static int Factorial(int n) {</code><br>' +
          '  <code>if (n <= 1) return 1;</code><br>' +
          '  <code>return n * Factorial(n - 1);</code><br>' +
          '<code>}</code><br><br>' +
          'Base case: n <= 1 returns 1.<br>' +
          'Recursive case: n * Factorial(n - 1).',
        hints: [
          'Base case: if n <= 1 return 1.',
          'Recursive case: return n * Factorial(n - 1).',
          'Loop from 0 to 10 and print each factorial.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static int Factorial(int n) {\n' +
          '        if (n <= 1) return 1;\n' +
          '        return n * Factorial(n - 1);\n' +
          '    }\n' +
          '\n' +
          '    static void Main(string[] args) {\n' +
          '        for (int i = 0; i <= 10; i++) {\n' +
          '            Console.WriteLine(i + "! = " + Factorial(i));\n' +
          '        }\n' +
          '    }\n' +
          '}',
        expectedOutput: '0! = 1\n1! = 1\n2! = 2\n3! = 6\n4! = 24\n5! = 120\n6! = 720\n7! = 5040\n8! = 40320\n9! = 362880\n10! = 3628800\n',
      },
      {
        id: 19,
        topicExerciseNum: 4,
        title: 'Optional parameter',
        description: 'Write a method `string Greet(string name, string greeting = "Hello")` that returns a greeting string.',
        skeleton: SKELETON_METHOD,
        concept:
          '<strong>Optional parameters</strong> have a default value.<br><br>' +
          '<code>static string Greet(string name, string greeting = "Hello") {</code><br>' +
          '  <code>return greeting + ", " + name + "!";</code><br>' +
          '<code>}</code><br><br>' +
          'Call with one argument: <code>Greet("Alice")</code> → "Hello, Alice!"<br>' +
          'Call with two: <code>Greet("Alice", "Hi")</code> → "Hi, Alice!"',
        hints: [
          'The greeting parameter should have a default value in the method signature.',
          'Return greeting + ", " + name + "!" or use string interpolation.',
          'Call the method with both one and two arguments.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static string Greet(string name, string greeting = "Hello") {\n' +
          '        return greeting + ", " + name + "!";\n' +
          '    }\n' +
          '\n' +
          '    static void Main(string[] args) {\n' +
          '        Console.WriteLine(Greet("Alice"));\n' +
          '        Console.WriteLine(Greet("Bob", "Hi"));\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Hello, Alice!\nHi, Bob!\n',
      },
      {
        id: 20,
        topicExerciseNum: 5,
        title: 'Params array sum',
        description: 'Write a method that takes a `params int[]` array and returns the sum of all values passed to it.',
        skeleton: SKELETON_METHOD,
        concept:
          '<strong>params</strong> allows passing a variable number of arguments.<br><br>' +
          '<code>static int SumAll(params int[] numbers) {</code><br>' +
          '  <code>int sum = 0;</code><br>' +
          '  <code>foreach (int n in numbers) sum += n;</code><br>' +
          '  <code>return sum;</code><br>' +
          '<code>}</code><br><br>' +
          'Call: <code>SumAll(1, 2, 3, 4, 5)</code> — no array syntax needed.',
        hints: [
          'Use the params keyword before int[] in the parameter list.',
          'Use a foreach loop to sum all values.',
          'Call the method with multiple comma-separated arguments.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static int SumAll(params int[] numbers) {\n' +
          '        int sum = 0;\n' +
          '        foreach (int n in numbers) sum += n;\n' +
          '        return sum;\n' +
          '    }\n' +
          '\n' +
          '    static void Main(string[] args) {\n' +
          '        Console.WriteLine(SumAll(1, 2, 3, 4, 5));\n' +
          '    }\n' +
          '}',
        expectedOutput: '15\n',
      },
    ],
  },
  {
    id: 5,
    title: 'Arrays & Lists',
    exercises: [
      {
        id: 21,
        topicExerciseNum: 1,
        title: 'Array sum and average',
        description: 'Declare an int array of size 5, fill it with values, and print the sum and average.',
        skeleton: SKELETON,
        concept:
          '<strong>Arrays</strong> store multiple values of the same type.<br><br>' +
          '<code>int[] arr = new int[5];</code><br>' +
          '<code>arr[0] = 10; arr[1] = 20; arr[2] = 30; arr[3] = 40; arr[4] = 50;</code><br><br>' +
          'Use a <code>for</code> or <code>foreach</code> loop to compute sum and average.',
        hints: [
          'Declare an int array of size 5 with literal values.',
          'Use a loop or foreach to compute the sum.',
          'Divide sum by arr.Length to get the average (use double).',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        int[] arr = { 10, 20, 30, 40, 50 };\n' +
          '        int sum = 0;\n' +
          '        foreach (int n in arr) sum += n;\n' +
          '        double avg = (double)sum / arr.Length;\n' +
          '        Console.WriteLine("Sum: " + sum + ", Avg: " + avg);\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Sum: 150, Avg: 30\n',
      },
      {
        id: 22,
        topicExerciseNum: 2,
        title: 'Reverse array in place',
        description: 'Reverse an int array in place without allocating a new one.',
        skeleton: SKELETON,
        concept:
          '<strong>In-place reversal</strong> swaps elements from both ends.<br><br>' +
          '<code>int left = 0, right = arr.Length - 1;</code><br>' +
          '<code>while (left < right) {</code><br>' +
          '  <code>int tmp = arr[left];</code><br>' +
          '  <code>arr[left] = arr[right];</code><br>' +
          '  <code>arr[right] = tmp;</code><br>' +
          '  <code>left++; right--;</code><br>' +
          '<code>}</code>',
        hints: [
          'Use two pointers: one at the start, one at the end.',
          'Swap values at both pointers, then move them inward.',
          'Stop when left >= right.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        int[] arr = { 1, 2, 3, 4, 5 };\n' +
          '        int l = 0, r = arr.Length - 1;\n' +
          '        while (l < r) {\n' +
          '            int tmp = arr[l]; arr[l] = arr[r]; arr[r] = tmp;\n' +
          '            l++; r--;\n' +
          '        }\n' +
          '        Console.WriteLine(string.Join(", ", arr));\n' +
          '    }\n' +
          '}',
        expectedOutput: '5, 4, 3, 2, 1\n',
      },
      {
        id: 23,
        topicExerciseNum: 3,
        title: 'List collection',
        description: 'Use a `List<int>` to collect numbers until the user types "done", then print the total.',
        skeleton: SKELETON_COLL,
        concept:
          '<strong>List&lt;T&gt;</strong> is a dynamically-sized collection.<br><br>' +
          '<code>List&lt;int&gt; numbers = new List&lt;int&gt;();</code><br>' +
          '<code>numbers.Add(42);</code><br><br>' +
          'Use <code>Console.ReadLine()</code> to get user input in a loop.',
        hints: [
          'Use a while loop with Console.ReadLine() to collect input.',
          'Parse each line to int with int.Parse() and Add to the list.',
          'Print the sum or count when the user types "done".',
        ],
        answer:
          'using System;\n' +
          'using System.Collections.Generic;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        List<int> numbers = new List<int>();\n' +
          '        string input;\n' +
          '        while ((input = Console.ReadLine()) != "done") {\n' +
          '            numbers.Add(int.Parse(input));\n' +
          '        }\n' +
          '        int total = 0;\n' +
          '        foreach (int n in numbers) total += n;\n' +
          '        Console.WriteLine("Total: " + total);\n' +
          '    }\n' +
          '}',
      },
      {
        id: 24,
        topicExerciseNum: 4,
        title: 'Sort and binary search',
        description: 'Sort an int array using `Array.Sort` and then search for a value using `Array.BinarySearch`.',
        skeleton: SKELETON,
        concept:
          '<strong>Array.Sort</strong> sorts in place.<br>' +
          '<strong>Array.BinarySearch</strong> finds an element in O(log n) time.<br><br>' +
          '<code>Array.Sort(arr);</code><br>' +
          '<code>int idx = Array.BinarySearch(arr, 42);</code><br><br>' +
          'BinarySearch returns the index if found, or a negative value if not found.',
        hints: [
          'Declare and sort the array with Array.Sort.',
          'Search for a specific value with Array.BinarySearch.',
          'Print the index returned by BinarySearch.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        int[] arr = { 5, 3, 8, 1, 9, 2 };\n' +
          '        Array.Sort(arr);\n' +
          '        int idx = Array.BinarySearch(arr, 8);\n' +
          '        Console.WriteLine("Index of 8: " + idx);\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Index of 8: 4\n',
      },
      {
        id: 25,
        topicExerciseNum: 5,
        title: '2D array grid',
        description: 'Create a 2D int[3,3] array, fill it with values, and print it as a grid.',
        skeleton: SKELETON,
        concept:
          '<strong>2D arrays</strong> use two indices:<br><br>' +
          '<code>int[,] grid = new int[3, 3];</code><br>' +
          '<code>grid[0, 0] = 1; grid[0, 1] = 2; ...</code><br><br>' +
          'Use nested for loops:<br>' +
          '<code>for (int r = 0; r < 3; r++)</code><br>' +
          '  <code>for (int c = 0; c < 3; c++)</code><br>' +
          '    <code>Console.Write(grid[r, c] + " ");</code>',
        hints: [
          'Declare int[,] grid = new int[3, 3].',
          'Fill each cell with r * 3 + c + 1 or your own pattern.',
          'Use nested loops to print it row by row.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        int[,] grid = new int[3, 3];\n' +
          '        for (int r = 0; r < 3; r++) {\n' +
          '            for (int c = 0; c < 3; c++) {\n' +
          '                grid[r, c] = r * 3 + c + 1;\n' +
          '            }\n' +
          '        }\n' +
          '        for (int r = 0; r < 3; r++) {\n' +
          '            for (int c = 0; c < 3; c++) {\n' +
          '                Console.Write(grid[r, c] + "\\t");\n' +
          '            }\n' +
          '            Console.WriteLine();\n' +
          '        }\n' +
          '    }\n' +
          '}',
        expectedOutput: '1\t2\t3\t\n4\t5\t6\t\n7\t8\t9\t\n',
      },
    ],
  },
  {
    id: 6,
    title: 'Strings',
    exercises: [
      {
        id: 26,
        topicExerciseNum: 1,
        title: 'String length and case',
        description: 'Read a string from the user and print its length, uppercased version, and lowercased version.',
        skeleton: SKELETON,
        concept:
          '<strong>String methods</strong>:<br>' +
          '<code>s.Length</code> — length of the string<br>' +
          '<code>s.ToUpper()</code> — uppercase version<br>' +
          '<code>s.ToLower()</code> — lowercase version',
        hints: [
          'Read a string with Console.ReadLine().',
          'Use .Length for length, .ToUpper() and .ToLower() for case.',
          'Print each result with Console.WriteLine.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        string s = Console.ReadLine();\n' +
          '        Console.WriteLine("Length: " + s.Length);\n' +
          '        Console.WriteLine("Upper: " + s.ToUpper());\n' +
          '        Console.WriteLine("Lower: " + s.ToLower());\n' +
          '    }\n' +
          '}',
      },
      {
        id: 27,
        topicExerciseNum: 2,
        title: 'Palindrome checker',
        description: 'Check if a string is a palindrome without using Reverse, using index-based comparison.',
        skeleton: SKELETON,
        concept:
          '<strong>Palindrome</strong>: a string that reads the same forwards and backwards.<br><br>' +
          '<code>bool IsPalindrome(string s) {</code><br>' +
          '  <code>int l = 0, r = s.Length - 1;</code><br>' +
          '  <code>while (l < r) {</code><br>' +
          '    <code>if (s[l] != s[r]) return false;</code><br>' +
          '    <code>l++; r--;</code><br>' +
          '  <code>}</code><br>' +
          '  <code>return true;</code><br>' +
          '<code>}</code>',
        hints: [
          'Use two pointers from both ends moving inward.',
          'Compare characters at both pointers.',
          'Return false if any pair does not match, true if all match.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        string s = "racecar";\n' +
          '        int l = 0, r = s.Length - 1;\n' +
          '        bool isPal = true;\n' +
          '        while (l < r) {\n' +
          '            if (s[l] != s[r]) { isPal = false; break; }\n' +
          '            l++; r--;\n' +
          '        }\n' +
          '        Console.WriteLine(isPal ? "Palindrome" : "Not a palindrome");\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Palindrome\n',
      },
      {
        id: 28,
        topicExerciseNum: 3,
        title: 'Word count',
        description: 'Count how many times a given word appears in a sentence using `Split` and a loop.',
        skeleton: SKELETON,
        concept:
          '<strong>String.Split</strong> separates a string into parts.<br><br>' +
          '<code>string[] words = sentence.Split(\' \');</code><br><br>' +
          'Loop through the array and count matches:<br>' +
          '<code>int count = 0;</code><br>' +
          '<code>foreach (string w in words) {</code><br>' +
          '  <code>if (w == target) count++;</code><br>' +
          '<code>}</code>',
        hints: [
          'Use Split with a space character to get words.',
          'Loop through the resulting array with foreach.',
          'Compare each word to the target and increment a counter.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        string sentence = "the cat in the hat";\n' +
          '        string target = "the";\n' +
          '        int count = 0;\n' +
          '        foreach (string w in sentence.Split(\' \')) {\n' +
          '            if (w == target) count++;\n' +
          '        }\n' +
          '        Console.WriteLine("\\"" + target + "\\" appears " + count + " times");\n' +
          '    }\n' +
          '}',
        expectedOutput: '"the" appears 2 times\n',
      },
      {
        id: 29,
        topicExerciseNum: 4,
        title: 'String.Format vs interpolation',
        description: 'Use `string.Format` and then string interpolation (`$""`) to produce the same output. Compare both.',
        skeleton: SKELETON,
        concept:
          '<strong>String.Format</strong>: <code>string.Format("Hello {0}, you are {1}", name, age)</code><br>' +
          '<strong>String interpolation</strong>: <code>$"Hello {name}, you are {age}"</code><br><br>' +
          'Interpolation (C# 6+) is more readable. Both produce the same result.',
        hints: [
          'Declare a name and age variable.',
          'Use string.Format with {0} and {1} placeholders.',
          'Use $"..." with {name} and {age} for the same output.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        string name = "Alice";\n' +
          '        int age = 30;\n' +
          '        string s1 = string.Format("Name: {0}, Age: {1}", name, age);\n' +
          '        string s2 = $"Name: {name}, Age: {age}";\n' +
          '        Console.WriteLine("Format: " + s1);\n' +
          '        Console.WriteLine("Interp: " + s2);\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Format: Name: Alice, Age: 30\nInterp: Name: Alice, Age: 30\n',
      },
      {
        id: 30,
        topicExerciseNum: 5,
        title: 'CSV line parser',
        description: 'Read a CSV line like "Alice,30,Engineer" and split it into name, age, and job. Print each field.',
        skeleton: SKELETON,
        concept:
          '<strong>CSV parsing</strong> splits on commas:<br><br>' +
          '<code>string csv = "Alice,30,Engineer";</code><br>' +
          '<code>string[] fields = csv.Split(\',\');</code><br>' +
          '<code>string name = fields[0];</code><br>' +
          '<code>string age = fields[1];</code><br>' +
          '<code>string job = fields[2];</code>',
        hints: [
          'Split the CSV string by comma character.',
          'Access each field by index from the resulting array.',
          'Print each field with a descriptive label.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        string csv = "Alice,30,Engineer";\n' +
          '        string[] parts = csv.Split(\',\');\n' +
          '        Console.WriteLine("Name: " + parts[0]);\n' +
          '        Console.WriteLine("Age: " + parts[1]);\n' +
          '        Console.WriteLine("Job: " + parts[2]);\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Name: Alice\nAge: 30\nJob: Engineer\n',
      },
    ],
  },
  {
    id: 7,
    title: 'Classes & Objects',
    exercises: [
      {
        id: 31,
        topicExerciseNum: 1,
        title: 'Define a Student class',
        description: 'Define a `Student` class with `Name`, `Age`, and `Grade` fields. Instantiate one, set its fields, and print them.',
        skeleton:
          'using System;\n' +
          '\n' +
          'class Student {\n' +
          '    \n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        \n' +
          '    }\n' +
          '}',
        concept:
          '<strong>Classes</strong> are blueprints for objects.<br><br>' +
          '<code>class Student {</code><br>' +
          '  <code>public string Name;</code><br>' +
          '  <code>public int Age;</code><br>' +
          '  <code>public double Grade;</code><br>' +
          '<code>}</code><br><br>' +
          'Fields are variables that belong to the class.',
        hints: [
          'Add public fields to the Student class: string Name, int Age, double Grade.',
          'In Main, create a new Student with new Student().',
          'Set each field and print the values.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Student {\n' +
          '    public string Name;\n' +
          '    public int Age;\n' +
          '    public double Grade;\n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        Student s = new Student();\n' +
          '        s.Name = "Alice"; s.Age = 20; s.Grade = 92.5;\n' +
          '        Console.WriteLine(s.Name + ", " + s.Age + ", " + s.Grade);\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Alice, 20, 92.5\n',
      },
      {
        id: 32,
        topicExerciseNum: 2,
        title: 'Constructor',
        description: 'Add a constructor to `Student` that sets all fields. Create three students and print a summary.',
        skeleton:
          'using System;\n' +
          '\n' +
          'class Student {\n' +
          '    \n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        \n' +
          '    }\n' +
          '}',
        concept:
          '<strong>Constructors</strong> initialize an object.<br><br>' +
          '<code>class Student {</code><br>' +
          '  <code>public Student(string name, int age, double grade) {</code><br>' +
          '    <code>Name = name; Age = age; Grade = grade;</code><br>' +
          '  <code>}</code><br>' +
          '<code>}</code><br><br>' +
          'Create: <code>new Student("Alice", 20, 92.5)</code>',
        hints: [
          'Write a constructor with three parameters: string name, int age, double grade.',
          'Assign each parameter to the corresponding field.',
          'Create three students and print all their details.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Student {\n' +
          '    public string Name;\n' +
          '    public int Age;\n' +
          '    public double Grade;\n' +
          '\n' +
          '    public Student(string name, int age, double grade) {\n' +
          '        Name = name; Age = age; Grade = grade;\n' +
          '    }\n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        Student[] students = new Student[] {\n' +
          '            new Student("Alice", 20, 92.5),\n' +
          '            new Student("Bob", 21, 85.0),\n' +
          '            new Student("Charlie", 19, 78.3),\n' +
          '        };\n' +
          '        foreach (var s in students) {\n' +
          '            Console.WriteLine(s.Name + " - " + s.Grade);\n' +
          '        }\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Alice - 92.5\nBob - 85\nCharlie - 78.3\n',
      },
      {
        id: 33,
        topicExerciseNum: 3,
        title: 'GetLetterGrade method',
        description: 'Add a method `GetLetterGrade()` to `Student` that returns A-F based on the grade field.',
        skeleton:
          'using System;\n' +
          '\n' +
          'class Student {\n' +
          '    \n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        \n' +
          '    }\n' +
          '}',
        concept:
          '<strong>Methods</strong> inside classes define behavior.<br><br>' +
          '<code>public string GetLetterGrade() {</code><br>' +
          '  <code>if (Grade >= 90) return "A";</code><br>' +
          '  <code>if (Grade >= 80) return "B";</code><br>' +
          '  <code>if (Grade >= 70) return "C";</code><br>' +
          '  <code>if (Grade >= 60) return "D";</code><br>' +
          '  <code>return "F";</code><br>' +
          '<code>}</code>',
        hints: [
          'Write a public method that returns string.',
          'Use if/else chains on the Grade field.',
          'Call the method on a Student object and print the result.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Student {\n' +
          '    public string Name;\n' +
          '    public int Age;\n' +
          '    public double Grade;\n' +
          '\n' +
          '    public Student(string name, int age, double grade) {\n' +
          '        Name = name; Age = age; Grade = grade;\n' +
          '    }\n' +
          '\n' +
          '    public string GetLetterGrade() {\n' +
          '        if (Grade >= 90) return "A";\n' +
          '        if (Grade >= 80) return "B";\n' +
          '        if (Grade >= 70) return "C";\n' +
          '        if (Grade >= 60) return "D";\n' +
          '        return "F";\n' +
          '    }\n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        Student s = new Student("Alice", 20, 92.5);\n' +
          '        Console.WriteLine(s.Name + ": " + s.GetLetterGrade());\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Alice: A\n',
      },
      {
        id: 34,
        topicExerciseNum: 4,
        title: 'ToString override',
        description: 'Add a `ToString()` override to `Student` that returns a formatted string. Print a Student directly.',
        skeleton:
          'using System;\n' +
          '\n' +
          'class Student {\n' +
          '    \n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        \n' +
          '    }\n' +
          '}',
        concept:
          '<strong>ToString()</strong> is overridden to provide a string representation of an object.<br><br>' +
          '<code>public override string ToString() {</code><br>' +
          '  <code>return $"Name: {Name}, Age: {Age}, Grade: {Grade} ({GetLetterGrade()})";</code><br>' +
          '<code>}</code><br><br>' +
          'Now <code>Console.WriteLine(student)</code> calls ToString automatically.',
        hints: [
          'Use the override keyword in the method signature.',
          'Return a formatted string with all fields.',
          'Pass a Student object directly to Console.WriteLine.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Student {\n' +
          '    public string Name;\n' +
          '    public int Age;\n' +
          '    public double Grade;\n' +
          '\n' +
          '    public Student(string name, int age, double grade) {\n' +
          '        Name = name; Age = age; Grade = grade;\n' +
          '    }\n' +
          '\n' +
          '    public override string ToString() {\n' +
          '        return $"Name: {Name}, Age: {Age}, Grade: {Grade:F1}";\n' +
          '    }\n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        Student s = new Student("Alice", 20, 92.5);\n' +
          '        Console.WriteLine(s);\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Name: Alice, Age: 20, Grade: 92.5\n',
      },
      {
        id: 35,
        topicExerciseNum: 5,
        title: 'Classroom with List<Student>',
        description: 'Create a `Classroom` class that holds a `List<Student>`. Add an `AddStudent` method and a `PrintAll` method.',
        skeleton:
          'using System;\n' +
          'using System.Collections.Generic;\n' +
          '\n' +
          'class Student {\n' +
          '    public string Name;\n' +
          '    public int Age;\n' +
          '    public double Grade;\n' +
          '\n' +
          '    public Student(string name, int age, double grade) {\n' +
          '        Name = name; Age = age; Grade = grade;\n' +
          '    }\n' +
          '\n' +
          '    public override string ToString() {\n' +
          '        return $"Name: {Name}, Age: {Age}, Grade: {Grade:F1}";\n' +
          '    }\n' +
          '}\n' +
          '\n' +
          'class Classroom {\n' +
          '    \n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        \n' +
          '    }\n' +
          '}',
        concept:
          '<strong>Composition</strong>: a class that contains a collection of other objects.<br><br>' +
          '<code>class Classroom {</code><br>' +
          '  <code>private List&lt;Student&gt; students = new List&lt;Student&gt;();</code><br>' +
          '  <code>public void AddStudent(Student s) => students.Add(s);</code><br>' +
          '  <code>public void PrintAll() {</code><br>' +
          '    <code>foreach (var s in students) Console.WriteLine(s);</code><br>' +
          '  <code>}</code><br>' +
          '<code>}</code>',
        hints: [
          'Add a List<Student> field to Classroom.',
          'AddStudent should call students.Add(s).',
          'PrintAll should loop and print each student.',
        ],
        answer:
          'using System;\n' +
          'using System.Collections.Generic;\n' +
          '\n' +
          'class Student {\n' +
          '    public string Name;\n' +
          '    public int Age;\n' +
          '    public double Grade;\n' +
          '\n' +
          '    public Student(string name, int age, double grade) {\n' +
          '        Name = name; Age = age; Grade = grade;\n' +
          '    }\n' +
          '\n' +
          '    public override string ToString() {\n' +
          '        return $"Name: {Name}, Age: {Age}, Grade: {Grade:F1}";\n' +
          '    }\n' +
          '}\n' +
          '\n' +
          'class Classroom {\n' +
          '    private List<Student> students = new List<Student>();\n' +
          '    public void AddStudent(Student s) => students.Add(s);\n' +
          '    public void PrintAll() {\n' +
          '        foreach (var s in students) Console.WriteLine(s);\n' +
          '    }\n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        Classroom c = new Classroom();\n' +
          '        c.AddStudent(new Student("Alice", 20, 92.5));\n' +
          '        c.AddStudent(new Student("Bob", 21, 85.0));\n' +
          '        c.PrintAll();\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Name: Alice, Age: 20, Grade: 92.5\nName: Bob, Age: 21, Grade: 85.0\n',
      },
    ],
  },
  {
    id: 8,
    title: 'Interfaces & Inheritance',
    exercises: [
      {
        id: 36,
        topicExerciseNum: 1,
        title: 'IShape interface',
        description: 'Create an interface `IShape` with a method `double Area()`. Implement it in `Circle` and `Rectangle` classes.',
        skeleton:
          'using System;\n' +
          '\n' +
          'interface IShape {\n' +
          '    \n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        \n' +
          '    }\n' +
          '}',
        concept:
          '<strong>Interfaces</strong> define contracts.<br><br>' +
          '<code>interface IShape { double Area(); }</code><br><br>' +
          '<code>class Circle : IShape {</code><br>' +
          '  <code>public double Radius;</code><br>' +
          '  <code>public double Area() => Math.PI * Radius * Radius;</code><br>' +
          '<code>}</code>',
        hints: [
          'The interface should declare double Area().',
          'Circle implements IShape and computes PI * r * r.',
          'Rectangle implements IShape and computes width * height.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'interface IShape {\n' +
          '    double Area();\n' +
          '}\n' +
          '\n' +
          'class Circle : IShape {\n' +
          '    public double Radius;\n' +
          '    public double Area() => Math.PI * Radius * Radius;\n' +
          '}\n' +
          '\n' +
          'class Rectangle : IShape {\n' +
          '    public double Width, Height;\n' +
          '    public double Area() => Width * Height;\n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        Circle c = new Circle() { Radius = 5 };\n' +
          '        Rectangle r = new Rectangle() { Width = 4, Height = 6 };\n' +
          '        Console.WriteLine("Circle area: " + c.Area());\n' +
          '        Console.WriteLine("Rect area: " + r.Area());\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Circle area: 78.53981633974483\nRect area: 24\n',
      },
      {
        id: 37,
        topicExerciseNum: 2,
        title: 'Virtual and override methods',
        description: 'Create a base class `Animal` with a virtual method `Speak()`. Override it in `Dog` and `Cat` subclasses.',
        skeleton:
          'using System;\n' +
          '\n' +
          'class Animal {\n' +
          '    \n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        \n' +
          '    }\n' +
          '}',
        concept:
          '<strong>Polymorphism</strong>: <code>virtual</code> and <code>override</code>.<br><br>' +
          '<code>class Animal { public virtual void Speak() => Console.WriteLine("..."); }</code><br>' +
          '<code>class Dog : Animal { public override void Speak() => Console.WriteLine("Woof!"); }</code><br>' +
          '<code>class Cat : Animal { public override void Speak() => Console.WriteLine("Meow!"); }</code>',
        hints: [
          'Add the virtual keyword to Speak() in Animal.',
          'Use override in Dog and Cat to provide specific implementations.',
          'Create a list of animals and loop through them calling Speak().',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'class Animal {\n' +
          '    public virtual void Speak() => Console.WriteLine("...");\n' +
          '}\n' +
          '\n' +
          'class Dog : Animal {\n' +
          '    public override void Speak() => Console.WriteLine("Woof!");\n' +
          '}\n' +
          '\n' +
          'class Cat : Animal {\n' +
          '    public override void Speak() => Console.WriteLine("Meow!");\n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        Animal[] animals = { new Dog(), new Cat() };\n' +
          '        foreach (Animal a in animals) a.Speak();\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Woof!\nMeow!\n',
      },
      {
        id: 38,
        topicExerciseNum: 3,
        title: 'Sealed class',
        description: 'Create a sealed class `BankAccount`. Try to inherit from it in a comment and read the compiler error.',
        skeleton:
          'using System;\n' +
          '\n' +
          'sealed class BankAccount {\n' +
          '    \n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        \n' +
          '    }\n' +
          '}',
        concept:
          '<strong>sealed</strong> prevents inheritance.<br><br>' +
          '<code>sealed class BankAccount { ... }</code><br>' +
          '<code>// class SavingsAccount : BankAccount { }  // Error: cannot derive from sealed type</code><br><br>' +
          'Sealed classes are useful for security, performance, and design clarity.',
        hints: [
          'Use the sealed keyword before class.',
          'Add a comment showing an attempt to inherit.',
          'Print a message from a BankAccount instance.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'sealed class BankAccount {\n' +
          '    public string Owner;\n' +
          '    public decimal Balance;\n' +
          '}\n' +
          '\n' +
          '// class SavingsAccount : BankAccount { }  // Error: cannot derive from sealed type\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        BankAccount b = new BankAccount() { Owner = "Alice", Balance = 1000 };\n' +
          '        Console.WriteLine(b.Owner + ": $" + b.Balance);\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Alice: $1000\n',
      },
      {
        id: 39,
        topicExerciseNum: 4,
        title: 'Polymorphic method',
        description: 'Write a method that accepts an `IShape` parameter and prints its area. Pass both a Circle and a Rectangle.',
        skeleton:
          'using System;\n' +
          '\n' +
          'interface IShape {\n' +
          '    double Area();\n' +
          '}\n' +
          '\n' +
          'class Circle : IShape {\n' +
          '    public double Radius;\n' +
          '    public double Area() => Math.PI * Radius * Radius;\n' +
          '}\n' +
          '\n' +
          'class Rectangle : IShape {\n' +
          '    public double Width, Height;\n' +
          '    public double Area() => Width * Height;\n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        \n' +
          '    }\n' +
          '}',
        concept:
          '<strong>Polymorphism</strong>: a method can accept any type that implements an interface.<br><br>' +
          '<code>static void PrintArea(IShape shape) {</code><br>' +
          '  <code>Console.WriteLine("Area: " + shape.Area());</code><br>' +
          '<code>}</code><br><br>' +
          'Pass any IShape: <code>PrintArea(new Circle { Radius = 5 });</code>',
        hints: [
          'Write a static method that takes IShape as a parameter.',
          'Call shape.Area() inside the method.',
          'Pass both a Circle and a Rectangle to the method.',
        ],
        answer:
          'using System;\n' +
          '\n' +
          'interface IShape { double Area(); }\n' +
          '\n' +
          'class Circle : IShape {\n' +
          '    public double Radius;\n' +
          '    public double Area() => Math.PI * Radius * Radius;\n' +
          '}\n' +
          '\n' +
          'class Rectangle : IShape {\n' +
          '    public double Width, Height;\n' +
          '    public double Area() => Width * Height;\n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void PrintArea(IShape s) {\n' +
          '        Console.WriteLine("Area: " + s.Area());\n' +
          '    }\n' +
          '\n' +
          '    static void Main(string[] args) {\n' +
          '        PrintArea(new Circle() { Radius = 5 });\n' +
          '        PrintArea(new Rectangle() { Width = 4, Height = 6 });\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Area: 78.53981633974483\nArea: 24\n',
      },
      {
        id: 40,
        topicExerciseNum: 5,
        title: 'IComparable<Student>',
        description: 'Add `IComparable<Student>` to `Student`. Sort a `List<Student>` by grade using `List.Sort`.',
        skeleton:
          'using System;\n' +
          'using System.Collections.Generic;\n' +
          '\n' +
          'class Student : IComparable<Student> {\n' +
          '    \n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        \n' +
          '    }\n' +
          '}',
        concept:
          '<strong>IComparable&lt;T&gt;</strong> enables sorting.<br><br>' +
          '<code>public int CompareTo(Student other) {</code><br>' +
          '  <code>return other.Grade.CompareTo(this.Grade); // descending</code><br>' +
          '<code>}</code><br><br>' +
          'Now <code>students.Sort()</code> sorts by grade in descending order.',
        hints: [
          'Implement CompareTo by comparing Grade fields.',
          'Use other.Grade.CompareTo(this.Grade) for descending order.',
          'Create a list, add students, call Sort, then print.',
        ],
        answer:
          'using System;\n' +
          'using System.Collections.Generic;\n' +
          '\n' +
          'class Student : IComparable<Student> {\n' +
          '    public string Name;\n' +
          '    public double Grade;\n' +
          '\n' +
          '    public Student(string name, double grade) {\n' +
          '        Name = name; Grade = grade;\n' +
          '    }\n' +
          '\n' +
          '    public int CompareTo(Student other) {\n' +
          '        return other.Grade.CompareTo(this.Grade);\n' +
          '    }\n' +
          '\n' +
          '    public override string ToString() => Name + ": " + Grade;\n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        List<Student> list = new List<Student>() {\n' +
          '            new Student("Alice", 92.5),\n' +
          '            new Student("Bob", 85.0),\n' +
          '            new Student("Charlie", 78.3),\n' +
          '        };\n' +
          '        list.Sort();\n' +
          '        foreach (var s in list) Console.WriteLine(s);\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Alice: 92.5\nBob: 85\nCharlie: 78.3\n',
      },
    ],
  },
  {
    id: 9,
    title: 'File I/O',
    exercises: [
      {
        id: 41,
        topicExerciseNum: 1,
        title: 'Write lines to a file',
        description: 'Write five lines of text to a file called `output.txt` using `File.WriteAllLines`.',
        skeleton: SKELETON_IO,
        concept:
          '<strong>File.WriteAllLines</strong> writes a string array to a file.<br><br>' +
          '<code>string[] lines = { "Line 1", "Line 2", "Line 3" };</code><br>' +
          '<code>File.WriteAllLines("output.txt", lines);</code><br><br>' +
          'Each element becomes a line in the file.',
        hints: [
          'Create a string array with five elements.',
          'Import System.IO with a using directive.',
          'Call File.WriteAllLines with the filename and array.',
        ],
        answer:
          'using System;\n' +
          'using System.IO;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        string[] lines = {\n' +
          '            "First line",\n' +
          '            "Second line",\n' +
          '            "Third line",\n' +
          '            "Fourth line",\n' +
          '            "Fifth line",\n' +
          '        };\n' +
          '        File.WriteAllLines("output.txt", lines);\n' +
          '        Console.WriteLine("File written.");\n' +
          '    }\n' +
          '}',
      },
      {
        id: 42,
        topicExerciseNum: 2,
        title: 'Read a file line by line',
        description: 'Read a text file line by line using `File.ReadAllLines` and print each line with its line number.',
        skeleton: SKELETON_IO,
        concept:
          '<strong>File.ReadAllLines</strong> returns a string array.<br><br>' +
          '<code>string[] lines = File.ReadAllLines("output.txt");</code><br>' +
          '<code>for (int i = 0; i < lines.Length; i++)</code><br>' +
          '  <code>Console.WriteLine($"{i + 1}: {lines[i]}");</code>',
        hints: [
          'Call File.ReadAllLines with the filename.',
          'Use a for loop with index to print line numbers.',
          'Format each line as "number: content".',
        ],
        answer:
          'using System;\n' +
          'using System.IO;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        string[] lines = File.ReadAllLines("output.txt");\n' +
          '        for (int i = 0; i < lines.Length; i++) {\n' +
          '            Console.WriteLine((i + 1) + ": " + lines[i]);\n' +
          '        }\n' +
          '    }\n' +
          '}',
      },
      {
        id: 43,
        topicExerciseNum: 3,
        title: 'Append to a file',
        description: 'Append a new line to an existing file using `File.AppendAllText`. Verify the file grows each run.',
        skeleton: SKELETON_IO,
        concept:
          '<strong>File.AppendAllText</strong> adds text to the end of a file.<br><br>' +
          '<code>File.AppendAllText("output.txt", "New line\\n");</code><br><br>' +
          'Running the program multiple times adds more lines. Use <code>File.ReadAllLines</code> to see the growth.',
        hints: [
          'Call File.AppendAllText with the filename and text.',
          'Add a newline character at the end of the appended text.',
          'Read and print the file before and after to see the growth.',
        ],
        answer:
          'using System;\n' +
          'using System.IO;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        File.AppendAllText("output.txt", "Appended line\\n");\n' +
          '        string[] lines = File.ReadAllLines("output.txt");\n' +
          '        Console.WriteLine("File has " + lines.Length + " lines");\n' +
          '        foreach (string line in lines) Console.WriteLine(line);\n' +
          '    }\n' +
          '}',
      },
      {
        id: 44,
        topicExerciseNum: 4,
        title: 'Check file existence',
        description: 'Check if a file exists before reading it. If it does not, create it with default content.',
        skeleton: SKELETON_IO,
        concept:
          '<strong>File.Exists</strong> checks if a file exists.<br><br>' +
          '<code>if (File.Exists("data.txt")) {</code><br>' +
          '  <code>string text = File.ReadAllText("data.txt");</code><br>' +
          '<code>} else {</code><br>' +
          '  <code>File.WriteAllText("data.txt", "Default content");</code><br>' +
          '<code>}</code>',
        hints: [
          'Use File.Exists to check for the file.',
          'If it exists, read and print its content.',
          'If not, create it with File.WriteAllText.',
        ],
        answer:
          'using System;\n' +
          'using System.IO;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        if (File.Exists("data.txt")) {\n' +
          '            string content = File.ReadAllText("data.txt");\n' +
          '            Console.WriteLine("Content: " + content);\n' +
          '        } else {\n' +
          '            File.WriteAllText("data.txt", "Default content\\n");\n' +
          '            Console.WriteLine("File created.");\n' +
          '        }\n' +
          '    }\n' +
          '}',
      },
      {
        id: 45,
        topicExerciseNum: 5,
        title: 'CSV student read/write',
        description: 'Write a list of Student objects to a CSV file, then read them back and reconstruct the list.',
        skeleton:
          'using System;\n' +
          'using System.IO;\n' +
          'using System.Collections.Generic;\n' +
          '\n' +
          'class Student {\n' +
          '    public string Name;\n' +
          '    public int Age;\n' +
          '    public double Grade;\n' +
          '\n' +
          '    public Student(string name, int age, double grade) {\n' +
          '        Name = name; Age = age; Grade = grade;\n' +
          '    }\n' +
          '\n' +
          '    public override string ToString() => Name + "," + Age + "," + Grade;\n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        \n' +
          '    }\n' +
          '}',
        concept:
          '<strong>CSV serialization</strong>:<br>' +
          '<code>File.WriteAllLines("students.csv", students.ConvertAll(s => s.ToString()));</code><br><br>' +
          'Read back:<br>' +
          '<code>string[] lines = File.ReadAllLines("students.csv");</code><br>' +
          '<code>foreach (string line in lines) {</code><br>' +
          '  <code>string[] parts = line.Split(\',\');</code><br>' +
          '  <code>students.Add(new Student(parts[0], int.Parse(parts[1]), double.Parse(parts[2])));</code><br>' +
          '<code>}</code>',
        hints: [
          'Convert each Student to CSV format and write with File.WriteAllLines.',
          'Read back with File.ReadAllLines, split each line.',
          'Parse each field and reconstruct Student objects.',
        ],
        answer:
          'using System;\n' +
          'using System.IO;\n' +
          'using System.Collections.Generic;\n' +
          '\n' +
          'class Student {\n' +
          '    public string Name;\n' +
          '    public int Age;\n' +
          '    public double Grade;\n' +
          '\n' +
          '    public Student(string name, int age, double grade) {\n' +
          '        Name = name; Age = age; Grade = grade;\n' +
          '    }\n' +
          '\n' +
          '    public override string ToString() => Name + "," + Age + "," + Grade;\n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        List<Student> students = new List<Student>() {\n' +
          '            new Student("Alice", 20, 92.5),\n' +
          '            new Student("Bob", 21, 85.0),\n' +
          '        };\n' +
          '        List<string> csvLines = new List<string>();\n' +
          '        foreach (var s in students) csvLines.Add(s.ToString());\n' +
          '        File.WriteAllLines("students.csv", csvLines);\n' +
          '\n' +
          '        List<Student> restored = new List<Student>();\n' +
          '        foreach (string line in File.ReadAllLines("students.csv")) {\n' +
          '            string[] p = line.Split(\',\');\n' +
          '            restored.Add(new Student(p[0], int.Parse(p[1]), double.Parse(p[2])));\n' +
          '        }\n' +
          '        foreach (var s in restored) Console.WriteLine(s.Name);\n' +
          '    }\n' +
          '}',
      },
    ],
  },
  {
    id: 10,
    title: 'LINQ',
    exercises: [
      {
        id: 46,
        topicExerciseNum: 1,
        title: 'Filter even numbers',
        description: 'Given a `List<int>`, use LINQ to filter out all even numbers and print the remaining ones.',
        skeleton: SKELETON_COLL_LINQ,
        concept:
          '<strong>LINQ Where</strong> filters a sequence.<br><br>' +
          '<code>var odds = numbers.Where(n => n % 2 != 0);</code><br><br>' +
          '<code>Where</code> takes a lambda expression that returns true for elements to keep.',
        hints: [
          'Add using System.Linq;',
          'Use Where with a lambda: n => n % 2 != 0.',
          'Iterate the result with foreach and print each number.',
        ],
        answer:
          'using System;\n' +
          'using System.Collections.Generic;\n' +
          'using System.Linq;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        List<int> numbers = new List<int>() { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };\n' +
          '        var odds = numbers.Where(n => n % 2 != 0);\n' +
          '        foreach (int n in odds) Console.WriteLine(n);\n' +
          '    }\n' +
          '}',
        expectedOutput: '1\n3\n5\n7\n9\n',
      },
      {
        id: 47,
        topicExerciseNum: 2,
        title: 'Filter and sort strings',
        description: 'Given a `List<string>`, use LINQ to find all strings longer than 4 characters and print them sorted.',
        skeleton: SKELETON_COLL_LINQ,
        concept:
          '<strong>LINQ method chaining</strong>:<br><br>' +
          '<code>var result = words.Where(w => w.Length > 4).OrderBy(w => w);</code><br><br>' +
          '<code>Where</code> filters, <code>OrderBy</code> sorts alphabetically.',
        hints: [
          'Use Where to filter strings with Length > 4.',
          'Chain OrderBy to sort the filtered results.',
          'Print each string in the result.',
        ],
        answer:
          'using System;\n' +
          'using System.Collections.Generic;\n' +
          'using System.Linq;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        List<string> words = new List<string>() { "cat", "elephant", "dog", "bird", "giraffe", "ant" };\n' +
          '        var longWords = words.Where(w => w.Length > 4).OrderBy(w => w);\n' +
          '        foreach (string w in longWords) Console.WriteLine(w);\n' +
          '    }\n' +
          '}',
        expectedOutput: 'elephant\ngiraffe\n',
      },
      {
        id: 48,
        topicExerciseNum: 3,
        title: 'Highest grade student',
        description: 'Given a `List<Student>`, use LINQ to find the student with the highest grade and print their name.',
        skeleton:
          'using System;\n' +
          'using System.Collections.Generic;\n' +
          'using System.Linq;\n' +
          '\n' +
          'class Student {\n' +
          '    public string Name;\n' +
          '    public double Grade;\n' +
          '\n' +
          '    public Student(string name, double grade) {\n' +
          '        Name = name; Grade = grade;\n' +
          '    }\n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        \n' +
          '    }\n' +
          '}',
        concept:
          '<strong>OrderByDescending</strong> + <strong>First</strong>:<br><br>' +
          '<code>var top = students.OrderByDescending(s => s.Grade).First();</code><br><br>' +
          'Or use <code>MaxBy</code> (C# 6+):<br>' +
          '<code>var top = students.MaxBy(s => s.Grade);</code>',
        hints: [
          'Use OrderByDescending on Grade to sort from highest to lowest.',
          'Call First() to get the student with the highest grade.',
          'Print the name of that student.',
        ],
        answer:
          'using System;\n' +
          'using System.Collections.Generic;\n' +
          'using System.Linq;\n' +
          '\n' +
          'class Student {\n' +
          '    public string Name;\n' +
          '    public double Grade;\n' +
          '\n' +
          '    public Student(string name, double grade) {\n' +
          '        Name = name; Grade = grade;\n' +
          '    }\n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        List<Student> students = new List<Student>() {\n' +
          '            new Student("Alice", 92.5),\n' +
          '            new Student("Bob", 85.0),\n' +
          '            new Student("Charlie", 78.3),\n' +
          '        };\n' +
          '        var top = students.OrderByDescending(s => s.Grade).First();\n' +
          '        Console.WriteLine("Top: " + top.Name);\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Top: Alice\n',
      },
      {
        id: 49,
        topicExerciseNum: 4,
        title: 'Sum, avg, min, max',
        description: 'Given a `List<int>`, use LINQ to compute the sum, average, min, and max in four separate queries.',
        skeleton: SKELETON_COLL_LINQ,
        concept:
          '<strong>LINQ aggregate operators</strong>:<br>' +
          '<code>numbers.Sum()</code><br>' +
          '<code>numbers.Average()</code><br>' +
          '<code>numbers.Min()</code><br>' +
          '<code>numbers.Max()</code><br><br>' +
          'Each returns a single value computed from the sequence.',
        hints: [
          'Call Sum(), Average(), Min(), and Max() on the list.',
          'Store each result in a variable or print directly.',
          'Make sure to include using System.Linq;',
        ],
        answer:
          'using System;\n' +
          'using System.Collections.Generic;\n' +
          'using System.Linq;\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        List<int> numbers = new List<int>() { 10, 20, 30, 40, 50 };\n' +
          '        Console.WriteLine("Sum: " + numbers.Sum());\n' +
          '        Console.WriteLine("Avg: " + numbers.Average());\n' +
          '        Console.WriteLine("Min: " + numbers.Min());\n' +
          '        Console.WriteLine("Max: " + numbers.Max());\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Sum: 150\nAvg: 30\nMin: 10\nMax: 50\n',
      },
      {
        id: 50,
        topicExerciseNum: 5,
        title: 'GroupBy letter grade',
        description: 'Given a `List<Student>`, group students by letter grade using `GroupBy` and print each group with its members.',
        skeleton:
          'using System;\n' +
          'using System.Collections.Generic;\n' +
          'using System.Linq;\n' +
          '\n' +
          'class Student {\n' +
          '    public string Name;\n' +
          '    public double Grade;\n' +
          '\n' +
          '    public Student(string name, double grade) {\n' +
          '        Name = name; Grade = grade;\n' +
          '    }\n' +
          '\n' +
          '    public string GetLetterGrade() {\n' +
          '        if (Grade >= 90) return "A";\n' +
          '        if (Grade >= 80) return "B";\n' +
          '        if (Grade >= 70) return "C";\n' +
          '        if (Grade >= 60) return "D";\n' +
          '        return "F";\n' +
          '    }\n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        \n' +
          '    }\n' +
          '}',
        concept:
          '<strong>GroupBy</strong> groups elements by a key.<br><br>' +
          '<code>var groups = students.GroupBy(s => s.GetLetterGrade());</code><br><br>' +
          'Each group has a <code>Key</code> property and is iterable:<br>' +
          '<code>foreach (var g in groups) {</code><br>' +
          '  <code>Console.WriteLine("Grade " + g.Key + ":");</code><br>' +
          '  <code>foreach (var s in g) Console.WriteLine("  " + s.Name);</code><br>' +
          '<code>}</code>',
        hints: [
          'Use GroupBy with a key selector: s => s.GetLetterGrade().',
          'Iterate the groups, print the Key (letter grade).',
          'For each group, iterate the students and print their names.',
        ],
        answer:
          'using System;\n' +
          'using System.Collections.Generic;\n' +
          'using System.Linq;\n' +
          '\n' +
          'class Student {\n' +
          '    public string Name;\n' +
          '    public double Grade;\n' +
          '\n' +
          '    public Student(string name, double grade) {\n' +
          '        Name = name; Grade = grade;\n' +
          '    }\n' +
          '\n' +
          '    public string GetLetterGrade() {\n' +
          '        if (Grade >= 90) return "A";\n' +
          '        if (Grade >= 80) return "B";\n' +
          '        if (Grade >= 70) return "C";\n' +
          '        if (Grade >= 60) return "D";\n' +
          '        return "F";\n' +
          '    }\n' +
          '}\n' +
          '\n' +
          'class Program {\n' +
          '    static void Main(string[] args) {\n' +
          '        List<Student> students = new List<Student>() {\n' +
          '            new Student("Alice", 92.5),\n' +
          '            new Student("Bob", 85.0),\n' +
          '            new Student("Charlie", 72.0),\n' +
          '            new Student("Diana", 95.0),\n' +
          '        };\n' +
          '        var groups = students.GroupBy(s => s.GetLetterGrade());\n' +
          '        foreach (var g in groups) {\n' +
          '            Console.WriteLine("Grade " + g.Key + ":");\n' +
          '            foreach (var s in g) Console.WriteLine("  " + s.Name);\n' +
          '        }\n' +
          '    }\n' +
          '}',
        expectedOutput: 'Grade A:\n  Alice\n  Diana\nGrade B:\n  Bob\nGrade C:\n  Charlie\n',
      },
    ],
  },
]

export const EXERCISES = TOPICS.flatMap(t => t.exercises)

export function checkCompletion(exercise, code) {
  if (!exercise) return false
  switch (exercise.id) {
    case 1:
      return /\bint\s+\w+\s*=\s*42\b/.test(code) && /Console\.Write(Line)?\s*\(/.test(code)
    case 2:
      return /\bstring\s/.test(code) && /\+\s*".*"/.test(code) && /Console\.Write(Line)?\s*\(/.test(code)
    case 3:
      return /\bdouble\s+\w+/.test(code) && /\bfloat\s+\w+/.test(code) && /Console\.Write(Line)?\s*\(/.test(code)
    case 4:
      return /\bvar\s+\w+\s*=/.test(code) && /\.GetType\s*\(\s*\)/.test(code)
    case 5:
      return /\bconst\s+double\s+PI\s*=/.test(code) && /\/\/.*PI\s*=/.test(code)
    case 6:
      return /\b[a-z]\s*[+\-*/%]\s*[a-z0-9]/.test(code) && /\+.*-.*\*.*\/.*%/.test(code)
    case 7:
      return /\bdouble\s+\w+\s*=\s*\w+\s*\*\s*9\s*\.?\s*0?\s*\/\s*5\s*\+\s*32\b/.test(code)
    case 8:
      return /\?\s*"even"\s*:\s*"odd"/.test(code)
    case 9:
      return /\+=\s*\d+/.test(code) && /-=\s*\d+/.test(code) && /\*=\s*\d+/.test(code) && /\/=\s*\d+/.test(code)
    case 10:
      return /\w+\s*\?\?\s*\w+/.test(code)
    case 11:
      return /\belse\s+if\b/.test(code) && /\bif\s*\(/.test(code) && /[A-F"]/.test(code)
    case 12:
      return /"FizzBuzz"/.test(code) && /"Fizz"/.test(code) && /"Buzz"/.test(code) && /\bfor\b/.test(code)
    case 13:
      return /\bswitch\b/.test(code) && /\d+\s*=>/.test(code) && /_\s*=>/.test(code)
    case 14:
      return /\bfor\b[\s\S]*\bfor\b/.test(code) && /\*/.test(code) && /Write(Line)?/.test(code)
    case 15:
      return /\bwhile\b[\s\S]*\bn\s*!=\s*1\b/.test(code) && /\bn\s*\/=\s*2\b/.test(code) && /\bn\s*=\s*3\s*\*/.test(code)
    case 16:
      return /\bstatic\s+int\s+Square\s*\(\s*int\s+\w+\s*\)/.test(code)
    case 17:
      return /\bstatic\s+bool\s+IsPrime\s*\(/.test(code) && /\bfor\b/.test(code) && /%/.test(code)
    case 18:
      return /\bstatic\s+int\s+Factorial\s*\(/.test(code) && /Factorial\s*\(/.test(code) && /\bif\s*\(/.test(code)
    case 19:
      return /static\s+string\s+Greet\s*\(/.test(code) && /\w+\s*=\s*"Hello"/.test(code)
    case 20:
      return /\bparams\s+int\s*\[\s*\]/.test(code) && /\bforeach\b/.test(code) && /\bSumAll\b/.test(code)
    case 21:
      return /\bint\s*\[\s*\]/.test(code) && /\bsum\b/.test(code) && /\bavg|average\b/.test(code)
    case 22:
      return /\bint\[\s*\]/.test(code) && /\.Length/.test(code) && /\bwhile\s*\(/.test(code)
    case 23:
      return /\bList\s*<\s*int\s*>/.test(code) && /\bAdd\b/.test(code) && /\bConsole\.ReadLine\b/.test(code)
    case 24:
      return /\bArray\.Sort\b/.test(code) && /\bArray\.BinarySearch\b/.test(code)
    case 25:
      return /\bint\s*\[\s*,\s*\]/.test(code) && /\bfor\b[\s\S]*\bfor\b/.test(code) && /Write/.test(code)
    case 26:
      return /\.Length/.test(code) && /\.ToUpper\s*\(/.test(code) && /\.ToLower\s*\(/.test(code)
    case 27:
      return /\bpalindrome|isPal\b/.test(code) && /\bwhile\b/.test(code) && /\w\[\s*l\s*\]\s*!=\s*\w\[\s*r\s*\]/.test(code)
    case 28:
      return /\.Split/.test(code) && /\bcount\b/.test(code) && /\bforeach\b/.test(code)
    case 29:
      return /\bstring\.Format\b/.test(code) && /\$"/.test(code)
    case 30:
      return /\.Split\s*\(\s*','/.test(code) && /\bcsv\b/.test(code)
    case 31:
      return /\bclass\s+Student\b/.test(code) && /\bpublic\s+string\s+Name\b/.test(code) && /\bnew\s+Student\s*\(/.test(code)
    case 32:
      return /\bpublic\s+Student\s*\(/.test(code) && /\bnew\s+Student\s*\(/.test(code)
    case 33:
      return /\bGetLetterGrade\s*\(/.test(code) && /\bif\b[\s\S]*\bif\b/.test(code) && /return\s+"[A-F]"/.test(code)
    case 34:
      return /\boverride\s+string\s+ToString\b/.test(code) && /Console\.WriteLine\s*\(\s*\w+\s*\)/.test(code)
    case 35:
      return /\bclass\s+Classroom\b/.test(code) && /\bAddStudent\b/.test(code) && /\bPrintAll\b/.test(code)
    case 36:
      return /\binterface\s+IShape\b/.test(code) && /\bclass\s+Circle\s*:\s*IShape\b/.test(code) && /\bclass\s+Rectangle\s*:\s*IShape\b/.test(code)
    case 37:
      return /\bvirtual\b/.test(code) && /\boverride\b/.test(code) && /\bDog\b/.test(code) && /\bCat\b/.test(code)
    case 38:
      return /\bsealed\s+class\s+BankAccount\b/.test(code) && /\/\/.*:\s*BankAccount/.test(code)
    case 39:
      return /\bIShape\b/.test(code) && /\bPrintArea\s*\(/.test(code) && /Circle.*Rectangle/.test(code)
    case 40:
      return /\bIComparable\s*<\s*Student\s*>/.test(code) && /\bCompareTo\b/.test(code) && /\bSort\b/.test(code)
    case 41:
      return /\bFile\.WriteAllLines\b/.test(code)
    case 42:
      return /\bFile\.ReadAllLines\b/.test(code) && /\bfor\b/.test(code)
    case 43:
      return /\bFile\.AppendAllText\b/.test(code) && /\bFile\.ReadAllLines\b/.test(code)
    case 44:
      return /\bFile\.Exists\b/.test(code) && /\bFile\.WriteAllText|File\.WriteAllLines\b/.test(code)
    case 45:
      return /\bFile\.WriteAllLines\b/.test(code) && /\bFile\.ReadAllLines\b/.test(code) && /\.Split\s*\(/.test(code)
    case 46:
      return /\bWhere\s*\(/.test(code) && /\bn\s*%\s*2\b/.test(code)
    case 47:
      return /\bWhere\s*\(/.test(code) && /\bOrderBy\s*\(/.test(code) && /\bLength\s*>\s*4\b/.test(code)
    case 48:
      return /\bOrderByDescending|MaxBy\b/.test(code) && /\.First\s*\(\s*\)/.test(code) && /\btop|highest\b/.test(code)
    case 49:
      return /\b\.Sum\s*\(\s*\)/.test(code) && /\b\.Average\s*\(\s*\)/.test(code) && /\b\.Min\s*\(\s*\)/.test(code) && /\b\.Max\s*\(\s*\)/.test(code)
    case 50:
      return /\bGroupBy\b/.test(code) && /\bGetLetterGrade\b/.test(code)
    default:
      return false
  }
}