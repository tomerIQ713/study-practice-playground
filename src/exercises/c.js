const SKELETON =
  '#include <stdio.h>\n' +
  '\n' +
  'int main() {\n' +
  '    \n' +
  '    return 0;\n' +
  '}'

const SKELETON_STDLIB =
  '#include <stdio.h>\n' +
  '#include <stdlib.h>\n' +
  '\n' +
  'int main() {\n' +
  '    \n' +
  '    return 0;\n' +
  '}'

const SKELETON_STRING =
  '#include <stdio.h>\n' +
  '#include <string.h>\n' +
  '\n' +
  'int main() {\n' +
  '    \n' +
  '    return 0;\n' +
  '}'

const SKELETON_STDLIB_STRING =
  '#include <stdio.h>\n' +
  '#include <stdlib.h>\n' +
  '#include <string.h>\n' +
  '\n' +
  'int main() {\n' +
  '    \n' +
  '    return 0;\n' +
  '}'

const SKELETON_FUNC =
  '#include <stdio.h>\n' +
  '\n' +
  '\n' +
  'int main() {\n' +
  '    \n' +
  '    return 0;\n' +
  '}'

const SKELETON_STDLIB_FUNC =
  '#include <stdio.h>\n' +
  '#include <stdlib.h>\n' +
  '\n' +
  '\n' +
  'int main() {\n' +
  '    \n' +
  '    return 0;\n' +
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
        description: 'Declare an `int` variable, assign it the value `42`, and print it using `printf`.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          '<strong>Variables</strong> store data in memory.<br><br>' +
          '<strong>Declaration:</strong><br>' +
          '<code>int x;</code> — declares an integer variable named x<br>' +
          '<code>int x = 42;</code> — declares and initializes<br><br>' +
          '<strong>Printing:</strong><br>' +
          '<code>printf("%d", x);</code> — prints the value of x<br>' +
          '<code>%d</code> is the format specifier for int.<br><br>' +
          'Always include <code>#include &lt;stdio.h&gt;</code> to use printf.',
        hints: [
          'What keyword in C creates a new variable — and what type holds whole numbers?',
          'How do you assign a value to a variable at the moment you declare it?',
          'What printf format specifier prints an int value?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    int x = 42;\n' +
          '    printf("%d\\n", x);\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "42\n",
        },
      {
        id: 2,
        topicExerciseNum: 2,
        title: 'Compute an average',
        description: 'Declare two `int` variables, assign them values, compute their average as a `float`, and print the result.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          'Use floating-point types for decimal results.<br><br>' +
          '<strong>Key trick:</strong> integer division truncates!<br>' +
          '<code>5 / 2</code> → <code>2</code> (int)<br>' +
          '<code>(5 + 2) / 2.0</code> → <code>3.5</code> (float)<br><br>' +
          '<strong>Cast to float:</strong><br>' +
          '<code>float avg = (a + b) / 2.0f;</code><br><br>' +
          '<strong>Print float:</strong> <code>printf("%f", avg);</code> or <code>%.2f</code> for 2 decimals.',
        hints: [
          'If you divide an int by an int, what happens to the fractional part?',
          'How can you force the division to produce a float — what could you change about the divisor?',
          'What printf format specifier prints a float?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    int a = 10, b = 3;\n' +
          '    float avg = (a + b) / 2.0f;\n' +
          '    printf("Average = %.2f\\n", avg);\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "Average = 6.50\n",
        },

      {
        id: 3,
        topicExerciseNum: 3,
        title: 'Swap without a third variable',
        description: 'Swap the values of two `int` variables without using a third temporary variable. Use addition/subtraction or XOR. Print values before and after.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          'Swapping without a temp uses arithmetic or bitwise XOR.<br><br>' +
          '<strong>Arithmetic method:</strong><br>' +
          '<code>a = a + b; b = a - b; a = a - b;</code><br><br>' +
          '<strong>XOR method:</strong><br>' +
          '<code>a = a ^ b; b = a ^ b; a = a ^ b;</code><br><br>' +
          '<strong>Note:</strong> The arithmetic method can overflow for very large ints. XOR avoids this but only works for integers.',
        hints: [
          'If a=5 and b=3, after a = a + b, what is a? Then b = a - b gives what? Then a = a - b?',
          'What does the ^ (XOR) operator do to individual bits?',
          'Can you swap a variable with itself using these methods? Try a=5, b=5 and see what happens.',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    int a = 5, b = 3;\n' +
          '    printf("Before: a=%d, b=%d\\n", a, b);\n' +
          '    a = a + b;\n' +
          '    b = a - b;\n' +
          '    a = a - b;\n' +
          '    printf("After: a=%d, b=%d\\n", a, b);\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "Before: a=5, b=3\nAfter: a=3, b=5\n",
        },

      {
        id: 4,
        topicExerciseNum: 4,
        title: 'sizeof() for basic types',
        description: 'Use `sizeof()` to print the byte size of `int`, `char`, `float`, and `double`. Print each with a label.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          '<code>sizeof(type)</code> returns the number of bytes a type occupies in memory.<br><br>' +
          '<strong>Typical sizes:</strong><br>' +
          '<code>sizeof(char)</code> → 1 byte<br>' +
          '<code>sizeof(int)</code> → 4 bytes<br>' +
          '<code>sizeof(float)</code> → 4 bytes<br>' +
          '<code>sizeof(double)</code> → 8 bytes<br><br>' +
          '<strong>Format specifier:</strong> use <code>%zu</code> to print <code>size_t</code> values.',
        hints: [
          'What operator (looks like a function) tells you how many bytes a type takes?',
          'What format specifier in printf prints the result of sizeof()?',
          'Which type do you expect to be the largest — and which the smallest?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    printf("int: %zu bytes\\n", sizeof(int));\n' +
          '    printf("char: %zu bytes\\n", sizeof(char));\n' +
          '    printf("float: %zu bytes\\n", sizeof(float));\n' +
          '    printf("double: %zu bytes\\n", sizeof(double));\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "int: 4 bytes\nchar: 1 bytes\nfloat: 4 bytes\ndouble: 8 bytes\n",
        },

      {
        id: 5,
        topicExerciseNum: 5,
        title: 'Integer overflow',
        description: 'Assign the maximum value of a signed `int` (`2147483647`) to a variable, then add 1. Print both values and observe what happens.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          'Integers have a fixed range and wrap around when exceeded.<br><br>' +
          '<strong>Signed int range:</strong> -2,147,483,648 to 2,147,483,647 (for 32-bit)<br><br>' +
          '<strong>Overflow behavior:</strong><br>' +
          'Adding 1 to <code>2147483647</code> gives <code>-2147483648</code> (wraps to negative).<br><br>' +
          'This is <strong>undefined behavior</strong> in C — compilers may optimize differently, but on most systems you will see wraparound due to two\'s complement representation.',
        hints: [
          'What is the largest value a signed 32-bit int can hold?',
          'In two\'s complement, what is the bit pattern of 2147483647 — and what happens when you add 1?',
          'What do you expect the output to be when you print max+1?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    int max = 2147483647;\n' +
          '    printf("Max int: %d\\n", max);\n' +
          '    printf("Max + 1: %d\\n", max + 1);\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "Max int: 2147483647\nMax + 1: -2147483648\n",
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
        title: 'Arithmetic calculator',
        description: 'Write a program that prints the sum, difference, product, quotient, and remainder of two integers.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          'C provides five basic arithmetic operators:<br><br>' +
          '<code>a + b</code> — addition<br>' +
          '<code>a - b</code> — subtraction<br>' +
          '<code>a * b</code> — multiplication<br>' +
          '<code>a / b</code> — integer division truncates toward zero<br>' +
          '<code>a % b</code> — modulo (remainder, integers only)<br><br>' +
          '<strong>Pitfall:</strong> <code>5 / 2</code> gives <code>2</code>, not <code>2.5</code>. Use floats for decimal division.',
        hints: [
          'What operator finds the remainder when 10 is divided by 3?',
          'If a=10 and b=3, what is a / b? Why isn\'t it 3.333?',
          'How many printf calls do you need to print all five results?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    int a = 10, b = 3;\n' +
          '    printf("Sum: %d\\n", a + b);\n' +
          '    printf("Difference: %d\\n", a - b);\n' +
          '    printf("Product: %d\\n", a * b);\n' +
          '    printf("Quotient: %d\\n", a / b);\n' +
          '    printf("Remainder: %d\\n", a % b);\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "Sum: 13\nDifference: 7\nProduct: 30\nQuotient: 3\nRemainder: 1\n",
        },

      {
        id: 7,
        topicExerciseNum: 2,
        title: 'Temperature conversion',
        description: 'Convert a Celsius temperature to Fahrenheit using the formula `F = C * 9/5 + 32`. Print both values with clear labels. Use `float` or `double`.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          'Use <code>float</code> for decimal temperatures.<br><br>' +
          '<strong>Formula:</strong> <code>F = C * 9.0 / 5.0 + 32</code><br><br>' +
          '<strong>Important:</strong> Use <code>9.0 / 5.0</code> not <code>9 / 5</code>.<br>' +
          'Integer division <code>9 / 5</code> gives <code>1</code>, ruining the formula.<br><br>' +
          '<strong>Example:</strong> 0°C = 32°F, 100°C = 212°F',
        hints: [
          'Why must you write 9.0/5.0 instead of 9/5 in the formula?',
          'What type should you use for celsius and fahrenheit variables?',
          'A float with 1 decimal place uses what format specifier in printf?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    float celsius = 25.0f;\n' +
          '    float fahrenheit = celsius * 9.0f / 5.0f + 32.0f;\n' +
          '    printf("%.1fC = %.1fF\\n", celsius, fahrenheit);\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "25.0C = 77.0F\n",
        },

      {
        id: 8,
        topicExerciseNum: 3,
        title: 'Even or odd',
        description: 'Use the modulo operator `%` to check if a number is even or odd. Print the number followed by "even" or "odd".',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          'The <strong>modulo operator</strong> <code>%</code> returns the remainder of division.<br><br>' +
          '<strong>Even/odd check:</strong><br>' +
          '<code>n % 2 == 0</code> → even (no remainder)<br>' +
          '<code>n % 2 != 0</code> → odd<br><br>' +
          'This works for positive and negative integers.',
        hints: [
          'What operator gives you the remainder when dividing?',
          'What does a number divided by 2 leave as remainder if it\'s even?',
          'How do you print different messages for even vs odd?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    int n = 7;\n' +
          '    if (n % 2 == 0)\n' +
          '        printf("%d is even\\n", n);\n' +
          '    else\n' +
          '        printf("%d is odd\\n", n);\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "7 is odd\n",
        },

      {
        id: 9,
        topicExerciseNum: 4,
        title: 'Compound assignment operators',
        description: 'Start with `x = 10`. Apply `+=`, `-=`, `*=`, `/=` in sequence and print the value of `x` after each operation.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          'Compound assignment operators combine an operation with assignment.<br><br>' +
          '<strong>Examples:</strong><br>' +
          '<code>x += 5</code> → same as <code>x = x + 5</code><br>' +
          '<code>x -= 3</code> → same as <code>x = x - 3</code><br>' +
          '<code>x *= 2</code> → same as <code>x = x * 2</code><br>' +
          '<code>x /= 4</code> → same as <code>x = x / 4</code><br>' +
          '<code>x %= 3</code> → same as <code>x = x % 3</code><br><br>' +
          'These operators make code shorter and often clearer.',
        hints: [
          'What does x += 5 do in terms of a longer expression?',
          'After x=10, if you do x += 5 then x -= 3, what is x?',
          'If x=20 and you do x /= 3, what happens since 20/3 is not a whole number?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    int x = 10;\n' +
          '    printf("Start: %d\\n", x);\n' +
          '    x += 5; printf("After += 5: %d\\n", x);\n' +
          '    x -= 3; printf("After -= 3: %d\\n", x);\n' +
          '    x *= 2; printf("After *= 2: %d\\n", x);\n' +
          '    x /= 4; printf("After /= 4: %d\\n", x);\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "Start: 10\nAfter += 5: 15\nAfter -= 3: 12\nAfter *= 2: 24\nAfter /= 4: 6\n",
        },

      {
        id: 10,
        topicExerciseNum: 5,
        title: 'Bitwise AND, OR, XOR',
        description: 'Use bitwise `&`, `|`, and `^` on two integers (e.g., 5 and 3). Print each operation result and add a comment explaining what it does.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          'Bitwise operators work on the binary representation of integers.<br><br>' +
          '<strong>Operators:</strong><br>' +
          '<code>a & b</code> — AND: 1 where both bits are 1<br>' +
          '<code>a | b</code> — OR: 1 where at least one bit is 1<br>' +
          '<code>a ^ b</code> — XOR: 1 where bits differ<br>' +
          '<code>~a</code> — NOT: flips all bits<br>' +
          '<code>a &lt;&lt; n</code> — shift left by n<br>' +
          '<code>a &gt;&gt; n</code> — shift right by n<br><br>' +
          '<strong>Example: 5 (0101) & 3 (0011) = 1 (0001)</strong>',
        hints: [
          'What is 5 in binary (4 bits)? What is 3 in binary?',
          'Bitwise AND on 5 (0101) and 3 (0011) gives what binary result?',
          'What about XOR on the same numbers — where do bits differ?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    int a = 5, b = 3;\n' +
          '    printf("%d & %d = %d  /* bitwise AND */\\n", a, b, a & b);\n' +
          '    printf("%d | %d = %d  /* bitwise OR */\\n", a, b, a | b);\n' +
          '    printf("%d ^ %d = %d  /* bitwise XOR */\\n", a, b, a ^ b);\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "5 & 3 = 1  /* bitwise AND */\n5 | 3 = 7  /* bitwise OR */\n5 ^ 3 = 6  /* bitwise XOR */\n",
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
        title: 'Grading with if/else if',
        description: 'Read a score (0–100) and print a letter grade: A (≥90), B (≥80), C (≥70), D (≥60), F (<60). Use `if` / `else if` / `else`.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          '<strong>if / else if / else</strong> lets your program make decisions.<br><br>' +
          '<strong>Syntax:</strong><br>' +
          '<code>if (condition) { ... }</code><br>' +
          '<code>else if (condition) { ... }</code><br>' +
          '<code>else { ... }</code><br><br>' +
          'Conditions are checked top-down; the first true branch runs. Use <code>&gt;=</code>, <code>&lt;=</code>, <code>==</code>, <code>!=</code> for comparisons.',
        hints: [
          'What keyword starts a conditional block? What keywords add more conditions?',
          'In what order should you check the grade boundaries — highest first or lowest first?',
          'What comparison checks if a score is 90 or above?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    int score = 85;\n' +
          '    if (score >= 90) printf("A\\n");\n' +
          '    else if (score >= 80) printf("B\\n");\n' +
          '    else if (score >= 70) printf("C\\n");\n' +
          '    else if (score >= 60) printf("D\\n");\n' +
          '    else printf("F\\n");\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "B\n",
        },

      {
        id: 12,
        topicExerciseNum: 2,
        title: 'FizzBuzz',
        description: 'Print numbers 1–50 in a loop. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", for multiples of both print "FizzBuzz".',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          'FizzBuzz tests basic loop + conditional logic.<br><br>' +
          '<strong>Algorithm:</strong><br>' +
          'For each number i from 1 to 50:<br>' +
          '• If i % 15 == 0 → print "FizzBuzz"<br>' +
          '• Else if i % 3 == 0 → print "Fizz"<br>' +
          '• Else if i % 5 == 0 → print "Buzz"<br>' +
          '• Else → print i itself<br><br>' +
          '<strong>Check 15 first!</strong> Otherwise "FizzBuzz" numbers get caught by the 3-only or 5-only check.',
        hints: [
          'What operator checks divisibility?',
          'If you check i%3==0 before i%15==0, what happens for numbers like 15?',
          'What loop runs a block for each number from 1 to 50?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    for (int i = 1; i <= 50; i++) {\n' +
          '        if (i % 15 == 0) printf("FizzBuzz\\n");\n' +
          '        else if (i % 3 == 0) printf("Fizz\\n");\n' +
          '        else if (i % 5 == 0) printf("Buzz\\n");\n' +
          '        else printf("%d\\n", i);\n' +
          '    }\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz\nFizz\n22\n23\nFizz\nBuzz\n26\nFizz\n28\n29\nFizzBuzz\n31\n32\nFizz\n34\nBuzz\nFizz\n37\n38\nFizz\nBuzz\n41\nFizz\n43\n44\nFizzBuzz\n46\n47\nFizz\n49\nBuzz\n",
        },

      {
        id: 13,
        topicExerciseNum: 3,
        title: 'Multiplication table',
        description: 'Use nested `for` loops to print a 10×10 multiplication table. Each row should show the products for that row number.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          'Nested loops place one loop inside another.<br><br>' +
          '<strong>Pattern for a table:</strong><br>' +
          '<code>for (int row = 1; row <= 10; row++) {</code> — outer loop (rows)<br>' +
          '<code>    for (int col = 1; col <= 10; col++) {</code> — inner loop (columns)<br>' +
          '<code>        printf("%d\\t", row * col);</code><br>' +
          '<code>    }</code><br>' +
          '<code>    printf("\\n");</code> — newline after each row<br>' +
          '<code>}</code><br><br>' +
          '<strong>\\t</strong> adds a tab character for aligned columns.',
        hints: [
          'The outer loop controls what — the row number or the column number?',
          'After the inner loop finishes one row, what must you print to move to the next line?',
          'What escape character creates a tab for column alignment?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    for (int r = 1; r <= 10; r++) {\n' +
          '        for (int c = 1; c <= 10; c++) {\n' +
          '            printf("%d\\t", r * c);\n' +
          '        }\n' +
          '        printf("\\n");\n' +
          '    }\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "1\t2\t3\t4\t5\t6\t7\t8\t9\t10\n2\t4\t6\t8\t10\t12\t14\t16\t18\t20\n3\t6\t9\t12\t15\t18\t21\t24\t27\t30\n4\t8\t12\t16\t20\t24\t28\t32\t36\t40\n5\t10\t15\t20\t25\t30\t35\t40\t45\t50\n6\t12\t18\t24\t30\t36\t42\t48\t54\t60\n7\t14\t21\t28\t35\t42\t49\t56\t63\t70\n8\t16\t24\t32\t40\t48\t56\t64\t72\t80\n9\t18\t27\t36\t45\t54\t63\t72\t81\t90\n10\t20\t30\t40\t50\t60\t70\t80\t90\t100\n",
        },

      {
        id: 14,
        topicExerciseNum: 4,
        title: 'Number guessing game',
        description: 'Generate a random number between 1 and 100. Let the user guess until they get it correct. Count and print the number of attempts.',
        seedSql: '',
        skeleton:
          '#include <stdio.h>\n' +
          '#include <stdlib.h>\n' +
          '#include <time.h>\n' +
          '\n' +
          'int main() {\n' +
          '    \n' +
          '    return 0;\n' +
          '}',
        inputHint: 'Enter an integer (the guess)',
        concept:
          'Combine loops, conditionals, and random numbers.<br><br>' +
          '<strong>Random setup:</strong><br>' +
          '<code>srand(time(0));</code> — seed once at program start<br>' +
          '<code>int target = rand() % 100 + 1;</code> — random 1–100<br><br>' +
          '<strong>Game loop:</strong><br>' +
          'Read a guess, increment attempts counter, give "too high" / "too low" feedback, repeat until correct.',
        hints: [
          'What function seeds the random number generator with the current time?',
          'rand() % 100 gives a number in what range — and what do you add to get 1–100?',
          'What loop keeps repeating until the guess equals the target?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '#include <stdlib.h>\n' +
          '#include <time.h>\n' +
          '\n' +
          'int main() {\n' +
          '    srand(time(0));\n' +
          '    int target = rand() % 100 + 1;\n' +
          '    int guess, attempts = 0;\n' +
          '    printf("Guess the number (1-100)!\\n");\n' +
          '    do {\n' +
          '        printf("Enter guess: ");\n' +
          '        scanf("%d", &guess);\n' +
          '        attempts++;\n' +
          '        if (guess > target) printf("Too high!\\n");\n' +
          '        else if (guess < target) printf("Too low!\\n");\n' +
          '        else printf("Correct in %d tries!\\n", attempts);\n' +
          '    } while (guess != target);\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "Guess the number (1-100)!\nEnter guess: ",
        },

      {
        id: 15,
        topicExerciseNum: 5,
        title: 'Collatz sequence',
        description: 'Start from a user-given number `n`. If `n` is even, divide by 2. If odd, multiply by 3 and add 1. Loop until `n` becomes 1. Print each step.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          'The Collatz conjecture: every positive integer eventually reaches 1.<br><br>' +
          '<strong>Algorithm:</strong><br>' +
          '<code>while (n != 1) {</code><br>' +
          '<code>    if (n % 2 == 0) n = n / 2;</code><br>' +
          '<code>    else n = n * 3 + 1;</code><br>' +
          '<code>    printf("%d\\n", n);</code><br>' +
          '<code>}</code><br><br>' +
          'Also known as the "3n + 1 problem". Still unproven after decades!',
        hints: [
          'How do you check if n is even vs odd?',
          'What loop keeps running as long as n is not 1?',
          'If n=6, what is the sequence of values?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    int n = 6;\n' +
          '    printf("%d ", n);\n' +
          '    while (n != 1) {\n' +
          '        if (n % 2 == 0) n = n / 2;\n' +
          '        else n = n * 3 + 1;\n' +
          '        printf("%d ", n);\n' +
          '    }\n' +
          '    printf("\\n");\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "6 3 10 5 16 8 4 2 1 \n",
        },

    ],
  },
  {
    id: 4,
    title: 'Functions',
    exercises: [
      {
        id: 16,
        topicExerciseNum: 1,
        title: 'Power function',
        description: 'Write `int power(int base, int exp)` that computes `base^exp` using a loop. Call it from `main()` and print the result.',
        seedSql: '',
        skeleton: SKELETON_FUNC,
        concept:
          'Functions group reusable logic.<br><br>' +
          '<strong>Signature:</strong><br>' +
          '<code>int power(int base, int exp) { ... }</code><br><br>' +
          '<strong>Implementation:</strong><br>' +
          '<code>int result = 1;</code><br>' +
          '<code>for (int i = 0; i < exp; i++) result *= base;</code><br>' +
          '<code>return result;</code><br><br>' +
          '<strong>Note:</strong> This uses O(n) time. For large exponents, use fast exponentiation.',
        hints: [
          'What goes in the function signature — return type, name, and what inside parentheses?',
          'How do you multiply base by itself exp times using a loop?',
          'What keyword sends the final result back to the caller?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int power(int base, int exp) {\n' +
          '    int r = 1;\n' +
          '    for (int i = 0; i < exp; i++) r *= base;\n' +
          '    return r;\n' +
          '}\n' +
          '\n' +
          'int main() {\n' +
          '    printf("2^10 = %d\\n", power(2, 10));\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "2^10 = 1024\n",
        },

      {
        id: 17,
        topicExerciseNum: 2,
        title: 'Prime check function',
        description: 'Write a function `int isPrime(int n)` that returns 1 if `n` is prime, 0 otherwise. Test it with several values from `main()`.',
        seedSql: '',
        skeleton: SKELETON_FUNC,
        concept:
          'A prime number is divisible only by 1 and itself.<br><br>' +
          '<strong>Algorithm:</strong><br>' +
          'If n < 2, return 0.<br>' +
          'Loop from 2 to sqrt(n): if n % i == 0, return 0.<br>' +
          'Return 1 at the end.<br><br>' +
          '<strong>Optimization:</strong> check only up to <code>n/2</code> (or better, <code>sqrt(n)</code>).<br><br>' +
          '<strong>Return type:</strong> 1 = true, 0 = false (C has no bool by default).',
        hints: [
          'What\'s the smallest prime number?',
          'If n is divisible by any number between 2 and n/2, is it prime?',
          'What return value means "not prime"?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int isPrime(int n) {\n' +
          '    if (n < 2) return 0;\n' +
          '    for (int i = 2; i <= n / 2; i++) {\n' +
          '        if (n % i == 0) return 0;\n' +
          '    }\n' +
          '    return 1;\n' +
          '}\n' +
          '\n' +
          'int main() {\n' +
          '    int nums[] = {1, 2, 3, 4, 5, 17, 20};\n' +
          '    int size = sizeof(nums) / sizeof(nums[0]);\n' +
          '    for (int i = 0; i < size; i++) {\n' +
          '        printf("%d: %s\\n", nums[i], isPrime(nums[i]) ? "prime" : "not prime");\n' +
          '    }\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "1: not prime\n2: prime\n3: prime\n4: not prime\n5: prime\n17: prime\n20: not prime\n",
        },

      {
        id: 18,
        topicExerciseNum: 3,
        title: 'Recursive factorial',
        description: 'Write a recursive function `int factorial(int n)` that computes n!. Test it for values 0 through 10 and print each result.',
        seedSql: '',
        skeleton: SKELETON_FUNC,
        concept:
          'A recursive function calls itself.<br><br>' +
          '<strong>Base case:</strong> <code>if (n <= 1) return 1;</code><br>' +
          '<strong>Recursive case:</strong> <code>return n * factorial(n - 1);</code><br><br>' +
          '<strong>Tracing factorial(4):</strong><br>' +
          '<code>4 * factorial(3)</code><br>' +
          '<code>4 * 3 * factorial(2)</code><br>' +
          '<code>4 * 3 * 2 * factorial(1)</code><br>' +
          '<code>4 * 3 * 2 * 1 = 24</code><br><br>' +
          'Every recursive function needs a base case to stop the recursion.',
        hints: [
          'What is the base case for factorial — when does the recursion stop?',
          'In the recursive case, factorial(n) calls factorial(n - 1). How do you combine the result?',
          'What happens if you forget the base case?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int factorial(int n) {\n' +
          '    if (n <= 1) return 1;\n' +
          '    return n * factorial(n - 1);\n' +
          '}\n' +
          '\n' +
          'int main() {\n' +
          '    for (int i = 0; i <= 10; i++) {\n' +
          '        printf("%d! = %d\\n", i, factorial(i));\n' +
          '    }\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "0! = 1\n1! = 1\n2! = 2\n3! = 6\n4! = 24\n5! = 120\n6! = 720\n7! = 5040\n8! = 40320\n9! = 362880\n10! = 3628800\n",
        },

      {
        id: 19,
        topicExerciseNum: 4,
        title: 'Array min and max',
        description: 'Write two functions: `int findMin(int arr[], int size)` returns the minimum, `int findMax(int arr[], int size)` returns the maximum. Test with an array in `main()`.',
        seedSql: '',
        skeleton: SKELETON_FUNC,
        concept:
          'Passing arrays to functions uses pointer decay.<br><br>' +
          '<strong>Array parameter:</strong> <code>int arr[]</code> or <code>int* arr</code> — both are equivalent.<br><br>' +
          '<strong>Find min pattern:</strong><br>' +
          '<code>int min = arr[0];</code><br>' +
          '<code>for (int i = 1; i < size; i++)</code><br>' +
          '<code>    if (arr[i] < min) min = arr[i];</code><br>' +
          '<code>return min;</code><br><br>' +
          'Always pass the size separately — arrays don\'t know their own length in C.',
        hints: [
          'How do you declare a function parameter that receives an array?',
          'To find the minimum, what should you initialize min to before the loop?',
          'Inside the loop, how do you know when you found a new minimum?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int findMin(int arr[], int size) {\n' +
          '    int m = arr[0];\n' +
          '    for (int i = 1; i < size; i++)\n' +
          '        if (arr[i] < m) m = arr[i];\n' +
          '    return m;\n' +
          '}\n' +
          '\n' +
          'int findMax(int arr[], int size) {\n' +
          '    int m = arr[0];\n' +
          '    for (int i = 1; i < size; i++)\n' +
          '        if (arr[i] > m) m = arr[i];\n' +
          '    return m;\n' +
          '}\n' +
          '\n' +
          'int main() {\n' +
          '    int nums[] = {7, 2, 9, 1, 5, 3};\n' +
          '    int n = sizeof(nums) / sizeof(nums[0]);\n' +
          '    printf("Min: %d\\n", findMin(nums, n));\n' +
          '    printf("Max: %d\\n", findMax(nums, n));\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "Min: 1\nMax: 9\n",
        },

      {
        id: 20,
        topicExerciseNum: 5,
        title: 'Caesar cipher encode',
        description: 'Write `char encode(char c, int shift)` that shifts a letter by `shift` positions, wrapping around at z. Test with `\'a\'` shifted by 3 and `\'z\'` shifted by 1.',
        seedSql: '',
        skeleton: SKELETON_FUNC,
        concept:
          'A Caesar cipher shifts letters by a fixed amount.<br><br>' +
          '<strong>Algorithm:</strong><br>' +
          '<code>if (c >= \'a\' && c <= \'z\') {</code><br>' +
          '<code>    c = ((c - \'a\' + shift) % 26) + \'a\';</code><br>' +
          '<code>}</code><br><br>' +
          '<strong>How it works:</strong><br>' +
          '1. <code>c - \'a\'</code> converts letter to 0–25<br>' +
          '2. Add shift<br>' +
          '3. <code>% 26</code> wraps around<br>' +
          '4. <code>+ \'a\'</code> converts back to ASCII<br><br>' +
          'Extend for uppercase letters similarly.',
        hints: [
          'How do you convert a character \'a\'–\'z\' to a number 0–25?',
          'What operator wraps a value around when it exceeds 25?',
          'After computing (letterIndex + shift) % 26, how do you convert back to a char?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'char encode(char c, int shift) {\n' +
          '    if (c >= \'a\' && c <= \'z\') {\n' +
          '        c = ((c - \'a\' + shift) % 26) + \'a\';\n' +
          '    }\n' +
          '    return c;\n' +
          '}\n' +
          '\n' +
          'int main() {\n' +
          '    printf("a + 3 = %c\\n", encode(\'a\', 3));\n' +
          '    printf("z + 1 = %c\\n", encode(\'z\', 1));\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "a + 3 = d\nz + 1 = a\n",
        },

    ],
  },
  {
    id: 5,
    title: 'Arrays',
    exercises: [
      {
        id: 21,
        topicExerciseNum: 1,
        title: 'Sum and average',
        description: 'Fill a 10-element `int` array with user input. Print the sum and the average (as a float).',
        seedSql: '',
        skeleton: SKELETON,
        inputHint: 'Enter 10 integers',
        concept:
          'Read values into an array using a loop, then compute statistics.<br><br>' +
          '<strong>Pattern:</strong><br>' +
          '<code>int arr[10];</code><br>' +
          '<code>for (int i = 0; i < 10; i++) {</code><br>' +
          '<code>    scanf("%d", &arr[i]);</code><br>' +
          '<code>}</code><br><br>' +
          '<strong>Average as float:</strong> cast or use float divisor<br>' +
          '<code>float avg = (float)sum / 10;</code>',
        hints: [
          'What loop reads 10 values into an array using scanf?',
          'How do you compute the sum of all elements in a loop?',
          'If sum is an int, how do you get a float average?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    int arr[10];\n' +
          '    printf("Enter 10 numbers:\\n");\n' +
          '    for (int i = 0; i < 10; i++) {\n' +
          '        scanf("%d", &arr[i]);\n' +
          '    }\n' +
          '    int sum = 0;\n' +
          '    for (int i = 0; i < 10; i++) {\n' +
          '        sum += arr[i];\n' +
          '    }\n' +
          '    printf("Sum: %d\\n", sum);\n' +
          '    printf("Average: %.2f\\n", (float)sum / 10);\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "Enter 10 numbers:\n",
        },

      {
        id: 22,
        topicExerciseNum: 2,
        title: 'Reverse array in place',
        description: 'Reverse the elements of an array in place without allocating a new array. Print before and after.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          'Reverse in place using two pointers (or two indices).<br><br>' +
          '<strong>Algorithm:</strong><br>' +
          '<code>int left = 0, right = size - 1;</code><br>' +
          '<code>while (left < right) {</code><br>' +
          '<code>    int tmp = arr[left];</code><br>' +
          '<code>    arr[left] = arr[right];</code><br>' +
          '<code>    arr[right] = tmp;</code><br>' +
          '<code>    left++; right--;</code><br>' +
          '<code>}</code><br><br>' +
          'This swaps pairs from the outside in until the middle is reached.',
        hints: [
          'What two indices do you start with to swap from both ends?',
          'When can you stop swapping — what condition tells you the array is fully reversed?',
          'How do you swap two elements without losing a value?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    int arr[] = {1, 2, 3, 4, 5, 6};\n' +
          '    int n = sizeof(arr) / sizeof(arr[0]);\n' +
          '    printf("Before: ");\n' +
          '    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n' +
          '    printf("\\n");\n' +
          '    for (int l = 0, r = n - 1; l < r; l++, r--) {\n' +
          '        int t = arr[l]; arr[l] = arr[r]; arr[r] = t;\n' +
          '    }\n' +
          '    printf("After: ");\n' +
          '    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n' +
          '    printf("\\n");\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "Before: 1 2 3 4 5 6 \nAfter: 6 5 4 3 2 1 \n",
        },

      {
        id: 23,
        topicExerciseNum: 3,
        title: 'Linear search',
        description: 'Write a function that searches for a value in an array and returns its index, or -1 if not found. Test it from `main()`.',
        seedSql: '',
        skeleton: SKELETON_FUNC,
        concept:
          'Linear search checks each element until the target is found.<br><br>' +
          '<strong>Algorithm:</strong><br>' +
          '<code>int search(int arr[], int size, int target) {</code><br>' +
          '<code>    for (int i = 0; i < size; i++)</code><br>' +
          '<code>        if (arr[i] == target) return i;</code><br>' +
          '<code>    return -1;</code><br>' +
          '<code>}</code><br><br>' +
          '<strong>Sentinel:</strong> -1 means "not found" (since 0 is a valid index).<br><br>' +
          'Time complexity: O(n) — worst case checks every element.',
        hints: [
          'What return value indicates the target was not found? Why not 0?',
          'What loop traverses the array element by element?',
          'What condition checks if the current element matches the target?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int search(int arr[], int size, int target) {\n' +
          '    for (int i = 0; i < size; i++) {\n' +
          '        if (arr[i] == target) return i;\n' +
          '    }\n' +
          '    return -1;\n' +
          '}\n' +
          '\n' +
          'int main() {\n' +
          '    int nums[] = {5, 2, 8, 1, 9};\n' +
          '    int n = sizeof(nums) / sizeof(nums[0]);\n' +
          '    printf("Index of 8: %d\\n", search(nums, n, 8));\n' +
          '    printf("Index of 3: %d\\n", search(nums, n, 3));\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "Index of 8: 2\nIndex of 3: -1\n",
        },

      {
        id: 24,
        topicExerciseNum: 4,
        title: 'Bubble sort',
        description: 'Implement bubble sort on an `int` array of size 10. Print the array before and after sorting.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          'Bubble sort repeatedly steps through the array, swapping adjacent elements if they\'re in the wrong order.<br><br>' +
          '<strong>Algorithm:</strong><br>' +
          '<code>for (int i = 0; i < n - 1; i++) {</code><br>' +
          '<code>    for (int j = 0; j < n - 1 - i; j++) {</code><br>' +
          '<code>        if (arr[j] > arr[j + 1]) {</code><br>' +
          '<code>            // swap arr[j] and arr[j+1]</code><br>' +
          '<code>        }</code><br>' +
          '<code>    }</code><br>' +
          '<code>}</code><br><br>' +
          'After each pass, the largest remaining element "bubbles" to its correct position at the end.',
        hints: [
          'After the first pass of bubble sort on [5,3,1], which element is guaranteed to be in the right place?',
          'In the inner loop, why does j go only up to n - 1 - i?',
          'What condition tells you that two adjacent elements are out of order?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    int arr[10] = {7, 2, 9, 1, 5, 3, 8, 4, 6, 0};\n' +
          '    int n = 10;\n' +
          '    printf("Before: ");\n' +
          '    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n' +
          '    printf("\\n");\n' +
          '    for (int i = 0; i < n - 1; i++) {\n' +
          '        for (int j = 0; j < n - 1 - i; j++) {\n' +
          '            if (arr[j] > arr[j + 1]) {\n' +
          '                int t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t;\n' +
          '            }\n' +
          '        }\n' +
          '    }\n' +
          '    printf("After: ");\n' +
          '    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n' +
          '    printf("\\n");\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "Before: 7 2 9 1 5 3 8 4 6 0 \nAfter: 0 1 2 3 4 5 6 7 8 9 \n",
        },

      {
        id: 25,
        topicExerciseNum: 5,
        title: 'Matrix multiplication',
        description: 'Multiply two 3×3 matrices stored as `int[3][3]` arrays and print the result matrix.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          'Matrix multiplication: C[i][j] = sum of A[i][k] * B[k][j] for all k.<br><br>' +
          '<strong>Triple loop pattern:</strong><br>' +
          '<code>for (int i = 0; i < 3; i++) {</code><br>' +
          '<code>    for (int j = 0; j < 3; j++) {</code><br>' +
          '<code>        C[i][j] = 0;</code><br>' +
          '<code>        for (int k = 0; k < 3; k++) {</code><br>' +
          '<code>            C[i][j] += A[i][k] * B[k][j];</code><br>' +
          '<code>        }</code><br>' +
          '<code>    }</code><br>' +
          '<code>}</code><br><br>' +
          '<strong>Requirement:</strong> A columns must equal B rows (both 3 here).',
        hints: [
          'How many nested loops does matrix multiplication need?',
          'What is the inner operation for computing C[i][j]?',
          'What should you set C[i][j] to before accumulating the sum?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    int A[3][3] = {{1,2,3},{4,5,6},{7,8,9}};\n' +
          '    int B[3][3] = {{9,8,7},{6,5,4},{3,2,1}};\n' +
          '    int C[3][3];\n' +
          '    for (int i = 0; i < 3; i++) {\n' +
          '        for (int j = 0; j < 3; j++) {\n' +
          '            C[i][j] = 0;\n' +
          '            for (int k = 0; k < 3; k++) {\n' +
          '                C[i][j] += A[i][k] * B[k][j];\n' +
          '            }\n' +
          '        }\n' +
          '    }\n' +
          '    printf("Result:\\n");\n' +
          '    for (int i = 0; i < 3; i++) {\n' +
          '        for (int j = 0; j < 3; j++) {\n' +
          '            printf("%d\\t", C[i][j]);\n' +
          '        }\n' +
          '        printf("\\n");\n' +
          '    }\n' +
          '    return 0;\n' +
          '}',
          expectedOutput: "Result:\n30\t24\t18\t\n84\t69\t54\t\n138\t114\t90\t\n",
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
        title: 'Manual string length',
        description: 'Count the characters in a string by looping until `\'\\0\'`, without using `strlen`. Print the length.',
        seedSql: '',
        skeleton: SKELETON_STRING,
        concept:
          'C strings are null-terminated: the last character is <code>\'\\0\'</code> (ASCII 0).<br><br>' +
          '<strong>Manual length:</strong><br>' +
          '<code>int len = 0;</code><br>' +
          '<code>while (s[len] != \'\\0\') len++;</code><br><br>' +
          'This is exactly what <code>strlen</code> does internally.<br><br>' +
          '<strong>Pitfall:</strong> forgetting to allocate space for the null terminator when creating strings dynamically.',
        hints: [
          'What character marks the end of a C string?',
          'What loop continues as long as the current character is not the null terminator?',
          'After the loop ends, what does the counter variable represent?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '#include <string.h>\n' +
          '\n' +
          'int main() {\n' +
          '    char s[] = "hello";\n' +
          '    int len = 0;\n' +
          '    while (s[len] != \'\\0\') len++;\n' +
          '    printf("Length: %d\\n", len);\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "Length: 5\n",
      },
      {
        id: 27,
        topicExerciseNum: 2,
        title: 'Reverse a string with pointers',
        description: 'Reverse a string in place using two pointers: one from the start, one from the end. Swap characters as they move toward the middle.',
        seedSql: '',
        skeleton: SKELETON_STRING,
        concept:
          'Two-pointer technique for in-place reversal.<br><br>' +
          '<strong>Algorithm:</strong><br>' +
          '<code>char* left = s;</code><br>' +
          '<code>char* right = s + strlen(s) - 1;</code><br>' +
          '<code>while (left < right) {</code><br>' +
          '<code>    char t = *left; *left = *right; *right = t;</code><br>' +
          '<code>    left++; right--;</code><br>' +
          '<code>}</code><br><br>' +
          'No extra array needed — swaps happen directly on the original string.',
        hints: [
          'Where does the left pointer start, and where does the right pointer start?',
          'When can you stop swapping — what condition involves the two pointers?',
          'How do you swap the characters that two pointers point to?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '#include <string.h>\n' +
          '\n' +
          'int main() {\n' +
          '    char s[] = "hello";\n' +
          '    char* l = s;\n' +
          '    char* r = s + strlen(s) - 1;\n' +
          '    while (l < r) {\n' +
          '        char t = *l; *l = *r; *r = t;\n' +
          '        l++; r--;\n' +
          '    }\n' +
          '    printf("Reversed: %s\\n", s);\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "Reversed: olleh\n",
      },
      {
        id: 28,
        topicExerciseNum: 3,
        title: 'Count vowels',
        description: 'Count the number of vowels (a, e, i, o, u) in a string entered by the user. Print the total count.',
        seedSql: '',
        skeleton: SKELETON_STRING,
        inputHint: 'Enter a word (no spaces)',
        concept:
          'Iterate through each character and check for vowels.<br><br>' +
          '<strong>Pattern:</strong><br>' +
          '<code>int count = 0;</code><br>' +
          '<code>for (int i = 0; s[i] != \'\\0\'; i++) {</code><br>' +
          '<code>    char c = tolower(s[i]);</code><br>' +
          '<code>    if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\')</code><br>' +
          '<code>        count++;</code><br>' +
          '<code>}</code><br><br>' +
          'Use <code>tolower</code> (from <code>ctype.h</code>) to handle uppercase vowels too.',
        hints: [
          'How do you iterate through each character of a string?',
          'How do you handle both uppercase and lowercase vowels?',
          'What condition checks if a character is any of the five vowels?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '#include <string.h>\n' +
          '#include <ctype.h>\n' +
          '\n' +
          'int main() {\n' +
          '    char s[100];\n' +
          '    printf("Enter a string: ");\n' +
          '    scanf("%s", s);\n' +
          '    int count = 0;\n' +
          '    for (int i = 0; s[i]; i++) {\n' +
          '        char c = tolower(s[i]);\n' +
          '        if (c == \'a\' || c == \'e\' || c == \'i\' || c == \'o\' || c == \'u\') count++;\n' +
          '    }\n' +
          '    printf("Vowel count: %d\\n", count);\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "Enter a string: Vowel count: 0\n",
      },
      {
        id: 29,
        topicExerciseNum: 4,
        title: 'Palindrome check',
        description: 'Write a function `int isPalindrome(char s[])` that returns 1 if the string reads the same forwards and backwards. Test it with "racecar" and "hello".',
        seedSql: '',
        skeleton: SKELETON_FUNC,
        concept:
          'A palindrome is identical forward and backward.<br><br>' +
          '<strong>Algorithm:</strong><br>' +
          '<code>int l = 0, r = strlen(s) - 1;</code><br>' +
          '<code>while (l < r) {</code><br>' +
          '<code>    if (s[l] != s[r]) return 0;</code><br>' +
          '<code>    l++; r--;</code><br>' +
          '<code>}</code><br>' +
          '<code>return 1;</code><br><br>' +
          'Same two-pointer technique as reversing, but instead of swapping, compare and return 0 on mismatch.',
        hints: [
          'What two indices do you start with for checking a palindrome?',
          'When do you know the string is NOT a palindrome?',
          'If all character pairs match, what should the function return?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '#include <string.h>\n' +
          '\n' +
          'int isPalindrome(char s[]) {\n' +
          '    int l = 0, r = strlen(s) - 1;\n' +
          '    while (l < r) {\n' +
          '        if (s[l] != s[r]) return 0;\n' +
          '        l++; r--;\n' +
          '    }\n' +
          '    return 1;\n' +
          '}\n' +
          '\n' +
          'int main() {\n' +
          '    printf("racecar: %s\\n", isPalindrome("racecar") ? "yes" : "no");\n' +
          '    printf("hello: %s\\n", isPalindrome("hello") ? "yes" : "no");\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "racecar: yes\nhello: no\n",
      },
      {
        id: 30,
        topicExerciseNum: 5,
        title: 'Word count',
        description: 'Count the number of words in a sentence. A word is any sequence of non-space characters. Print the word count.',
        seedSql: '',
        skeleton: SKELETON_STRING,
        concept:
          'Word counting by tracking transitions between spaces and non-spaces.<br><br>' +
          '<strong>Algorithm (state machine):</strong><br>' +
          '<code>int count = 0, inWord = 0;</code><br>' +
          '<code>for (int i = 0; s[i]; i++) {</code><br>' +
          '<code>    if (s[i] != \' \' && !inWord) { count++; inWord = 1; }</code><br>' +
          '<code>    else if (s[i] == \' \') inWord = 0;</code><br>' +
          '<code>}</code><br><br>' +
          '<code>inWord</code> tracks whether we\'re currently inside a word. A new word is counted when we transition from space to non-space.',
        hints: [
          'What variable tracks whether you are currently inside a word?',
          'When do you increment the word count?',
          'How do you know when a word has ended?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '#include <string.h>\n' +
          '\n' +
          'int main() {\n' +
          '    char s[] = "hello world this is c";\n' +
          '    int count = 0, inWord = 0;\n' +
          '    for (int i = 0; s[i]; i++) {\n' +
          '        if (s[i] != \' \' && !inWord) { count++; inWord = 1; }\n' +
          '        else if (s[i] == \' \') inWord = 0;\n' +
          '    }\n' +
          '    printf("Word count: %d\\n", count);\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "Word count: 5\n",
      },
    ],
  },
  {
    id: 7,
    title: 'Pointers',
    exercises: [
      {
        id: 31,
        topicExerciseNum: 1,
        title: 'Address and dereference',
        description: 'Declare an `int`, print its value and address. Then change its value through a pointer using `*p = ...`. Print again to confirm the change.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          'A <strong>pointer</strong> stores a memory address.<br><br>' +
          '<strong>Operators:</strong><br>' +
          '<code>&x</code> — address-of operator: gets x\'s memory address<br>' +
          '<code>*p</code> — dereference operator: accesses the value at address p<br><br>' +
          '<strong>Pattern:</strong><br>' +
          '<code>int x = 42;</code><br>' +
          '<code>int* p = &x;</code><br>' +
          '<code>printf("%d", *p);</code> — prints 42<br>' +
          '<code>*p = 99;</code> — changes x to 99<br><br>' +
          'Print addresses with <code>%p</code> and cast to <code>(void*)</code>.',
        hints: [
          'What operator gives you the address of a variable?',
          'What operator gets the value stored at the address a pointer holds?',
          'If you change *p, does the original variable x change too?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    int x = 42;\n' +
          '    printf("Value: %d, Address: %p\\n", x, (void*)&x);\n' +
          '    int* p = &x;\n' +
          '    *p = 99;\n' +
          '    printf("After *p = 99: x = %d\\n", x);\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "Value: 42, Address: 000000000061FE14\nAfter *p = 99: x = 99\n",
      },
      {
        id: 32,
        topicExerciseNum: 2,
        title: 'Swap function with pointers',
        description: 'Write `void swap(int *a, int *b)` that swaps two integers using pointers. Call it from `main()` and print values before and after.',
        seedSql: '',
        skeleton: SKELETON_FUNC,
        concept:
          'Pointers let functions modify variables in the caller\'s scope.<br><br>' +
          '<strong>Swap pattern:</strong><br>' +
          '<code>void swap(int* a, int* b) {</code><br>' +
          '<code>    int t = *a;</code><br>' +
          '<code>    *a = *b;</code><br>' +
          '<code>    *b = t;</code><br>' +
          '<code>}</code><br><br>' +
          '<strong>Calling:</strong> <code>swap(&x, &y);</code> — pass addresses!<br><br>' +
          'Without pointers, swap would only swap local copies (pass-by-value).',
        hints: [
          'Why can\'t a regular function swap(int a, int b) actually swap two variables?',
          'What do you pass to swap() — the variables themselves or their addresses?',
          'Inside swap, how do you access the values to be swapped?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'void swap(int* a, int* b) {\n' +
          '    int t = *a;\n' +
          '    *a = *b;\n' +
          '    *b = t;\n' +
          '}\n' +
          '\n' +
          'int main() {\n' +
          '    int x = 5, y = 10;\n' +
          '    printf("Before: x=%d, y=%d\\n", x, y);\n' +
          '    swap(&x, &y);\n' +
          '    printf("After: x=%d, y=%d\\n", x, y);\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "Before: x=5, y=10\nAfter: x=10, y=5\n",
      },
      {
        id: 33,
        topicExerciseNum: 3,
        title: 'Walk array with pointer',
        description: 'Use a pointer to walk through an `int` array and print each element without using `[]` indexing. Use `*p` and `p++` to traverse.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          'Array names decay to pointers. <code>arr[i]</code> is equivalent to <code>*(arr + i)</code>.<br><br>' +
          '<strong>Pointer traversal:</strong><br>' +
          '<code>int* p = arr;</code> — p points to arr[0]<br>' +
          '<code>for (int i = 0; i < n; i++) {</code><br>' +
          '<code>    printf("%d ", *p);</code><br>' +
          '<code>    p++;</code><br>' +
          '<code>}</code><br><br>' +
          'Each <code>p++</code> advances by <code>sizeof(int)</code> bytes to the next element.',
        hints: [
          'If arr is an array of ints, what does arr by itself represent (without brackets)?',
          'What does p++ do in terms of memory — how many bytes does it skip?',
          'How do you access the value that a pointer p points to?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    int arr[] = {10, 20, 30, 40, 50};\n' +
          '    int* p = arr;\n' +
          '    int n = sizeof(arr) / sizeof(arr[0]);\n' +
          '    for (int i = 0; i < n; i++) {\n' +
          '        printf("%d ", *p);\n' +
          '        p++;\n' +
          '    }\n' +
          '    printf("\\n");\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "10 20 30 40 50 \n",
      },
      {
        id: 34,
        topicExerciseNum: 4,
        title: 'malloc and free',
        description: 'Use `malloc` to allocate an array of `n` integers (read `n` from user). Fill the array, print it, then `free` it. Always check if `malloc` returned `NULL`.',
        seedSql: '',
        skeleton: SKELETON_STDLIB,
        concept:
          '<strong>malloc</strong> allocates memory on the heap.<br><br>' +
          '<strong>Signature:</strong><br>' +
          '<code>void* malloc(size_t size);</code><br><br>' +
          '<strong>Usage:</strong><br>' +
          '<code>int* arr = (int*)malloc(n * sizeof(int));</code><br>' +
          '<code>if (!arr) { printf("malloc failed\\n"); return 1; }</code><br><br>' +
          '<strong>Always:</strong><br>' +
          '• Check for NULL after allocation<br>' +
          '• <code>free(arr)</code> when done<br>' +
          '• Use <code>sizeof(type)</code> for byte calculation',
        hints: [
          'What function allocates memory on the heap — and what does it return on failure?',
          'How many bytes do you allocate for n integers?',
          'What function releases allocated memory back to the system?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '#include <stdlib.h>\n' +
          '\n' +
          'int main() {\n' +
          '    int n = 5;\n' +
          '    int* arr = (int*)malloc(n * sizeof(int));\n' +
          '    if (!arr) { printf("malloc failed\\n"); return 1; }\n' +
          '    for (int i = 0; i < n; i++) arr[i] = (i + 1) * 10;\n' +
          '    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n' +
          '    printf("\\n");\n' +
          '    free(arr);\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "10 20 30 40 50 \n",
      },
      {
        id: 35,
        topicExerciseNum: 5,
        title: 'Dynamic array of strings',
        description: 'Use `malloc` to allocate an array of 5 strings (`char*`). Fill each with a short string, print all, then free every allocated block.',
        seedSql: '',
        skeleton: SKELETON_STDLIB_STRING,
        concept:
          'An array of strings is a <code>char**</code> — pointer to pointers.<br><br>' +
          '<strong>Two-level allocation:</strong><br>' +
          '1. <code>char** words = malloc(5 * sizeof(char*));</code><br>' +
          '2. <code>words[i] = malloc((len + 1) * sizeof(char));</code><br>' +
          '3. <code>strcpy(words[i], "hello");</code><br><br>' +
          '<strong>Freeing order:</strong><br>' +
          '1. Free each <code>words[i]</code><br>' +
          '2. Free <code>words</code> itself<br><br>' +
          'Free in reverse order of allocation!',
        hints: [
          'What type stores a dynamic array of strings — char* or char**?',
          'How many separate malloc calls do you need for 5 strings?',
          'When freeing, which comes first — freeing each string or freeing the outer array?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '#include <stdlib.h>\n' +
          '#include <string.h>\n' +
          '\n' +
          'int main() {\n' +
          '    char** words = (char**)malloc(5 * sizeof(char*));\n' +
          '    const char* data[] = {"cat", "dog", "bird", "fish", "frog"};\n' +
          '    for (int i = 0; i < 5; i++) {\n' +
          '        words[i] = (char*)malloc((strlen(data[i]) + 1) * sizeof(char));\n' +
          '        strcpy(words[i], data[i]);\n' +
          '    }\n' +
          '    for (int i = 0; i < 5; i++) printf("%s ", words[i]);\n' +
          '    printf("\\n");\n' +
          '    for (int i = 0; i < 5; i++) free(words[i]);\n' +
          '    free(words);\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "cat dog bird fish frog \n",
      },
    ],
  },
  {
    id: 8,
    title: 'Structs',
    exercises: [
      {
        id: 36,
        topicExerciseNum: 1,
        title: 'Define and print a struct',
        description: 'Define a `Student` struct with `name` (char array), `age` (int), and `grade` (float). Create one instance, set its fields, and print all fields with labels.',
        seedSql: '',
        skeleton: SKELETON_STRING,
        concept:
          'A <strong>struct</strong> groups related data into one type.<br><br>' +
          '<strong>Definition:</strong><br>' +
          '<code>typedef struct {</code><br>' +
          '<code>    char name[50];</code><br>' +
          '<code>    int age;</code><br>' +
          '<code>    float grade;</code><br>' +
          '<code>} Student;</code><br><br>' +
          '<strong>Usage:</strong><br>' +
          '<code>Student s;</code><br>' +
          '<code>strcpy(s.name, "Alice");</code><br>' +
          '<code>s.age = 20;</code><br>' +
          '<code>printf("Name: %s", s.name);</code>',
        hints: [
          'What keyword begins a struct definition?',
          'What keyword creates a shorthand alias for the struct type?',
          'How do you access a field of a struct variable — what operator goes between the variable and field name?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '#include <string.h>\n' +
          '\n' +
          'typedef struct {\n' +
          '    char name[50];\n' +
          '    int age;\n' +
          '    float grade;\n' +
          '} Student;\n' +
          '\n' +
          'int main() {\n' +
          '    Student s;\n' +
          '    strcpy(s.name, "Alice");\n' +
          '    s.age = 20;\n' +
          '    s.grade = 88.5;\n' +
          '    printf("Name: %s\\n", s.name);\n' +
          '    printf("Age: %d\\n", s.age);\n' +
          '    printf("Grade: %.1f\\n", s.grade);\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "Name: Alice\nAge: 20\nGrade: 88.5\n",
      },
      {
        id: 37,
        topicExerciseNum: 2,
        title: 'Array of structs',
        description: 'Create an array of 5 `Student` structs. Fill them via user input (or hardcoded data) and print a summary table.',
        seedSql: '',
        skeleton: SKELETON_STRING,
        concept:
          'Arrays of structs work the same as arrays of basic types.<br><br>' +
          '<strong>Declaration:</strong> <code>Student students[5];</code><br><br>' +
          '<strong>Access pattern:</strong><br>' +
          '<code>for (int i = 0; i < 5; i++) {</code><br>' +
          '<code>    printf("%s\\t%d\\t%.1f\\n",</code><br>' +
          '<code>           students[i].name,</code><br>' +
          '<code>           students[i].age,</code><br>' +
          '<code>           students[i].grade);</code><br>' +
          '<code>}</code>',
        hints: [
          'How do you create an array that holds 5 Student structs?',
          'How do you access the name field of the third student in the array?',
          'What loop prints all students in a table format?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '#include <string.h>\n' +
          '\n' +
          'typedef struct {\n' +
          '    char name[50];\n' +
          '    int age;\n' +
          '    float grade;\n' +
          '} Student;\n' +
          '\n' +
          'int main() {\n' +
          '    Student students[5] = {\n' +
          '        {"Alice", 20, 88.5},\n' +
          '        {"Bob", 19, 72.0},\n' +
          '        {"Charlie", 21, 91.0},\n' +
          '        {"Diana", 20, 85.0},\n' +
          '        {"Eve", 18, 79.5}\n' +
          '    };\n' +
          '    printf("Name\\tAge\\tGrade\\n");\n' +
          '    for (int i = 0; i < 5; i++) {\n' +
          '        printf("%s\\t%d\\t%.1f\\n", students[i].name, students[i].age, students[i].grade);\n' +
          '    }\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "Name\tAge\tGrade\nAlice\t20\t88.5\nBob\t19\t72.0\nCharlie\t21\t91.0\nDiana\t20\t85.0\nEve\t18\t79.5\n",
      },
      {
        id: 38,
        topicExerciseNum: 3,
        title: 'Heap-allocated struct',
        description: 'Allocate a `Student` on the heap with `malloc`, fill its fields using `->` notation, print it, and `free` it.',
        seedSql: '',
        skeleton: SKELETON_STDLIB_STRING,
        concept:
          'Struct pointers use the <code>-></code> operator for field access.<br><br>' +
          '<strong>Pattern:</strong><br>' +
          '<code>Student* s = (Student*)malloc(sizeof(Student));</code><br>' +
          '<code>strcpy(s->name, "Alice");</code><br>' +
          '<code>s->age = 20;</code><br>' +
          '<code>printf("Name: %s", s->name);</code><br>' +
          '<code>free(s);</code><br><br>' +
          '<strong>-> vs . :</strong><br>' +
          '<code>s-&gt;name</code> is equivalent to <code>(*s).name</code><br><br>' +
          'Always free heap-allocated structs to avoid memory leaks.',
        hints: [
          'How many bytes do you malloc for one Student struct?',
          'What operator accesses a struct field through a pointer?',
          'What function releases the allocated memory back to the heap?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '#include <stdlib.h>\n' +
          '#include <string.h>\n' +
          '\n' +
          'typedef struct {\n' +
          '    char name[50];\n' +
          '    int age;\n' +
          '    float grade;\n' +
          '} Student;\n' +
          '\n' +
          'int main() {\n' +
          '    Student* s = (Student*)malloc(sizeof(Student));\n' +
          '    strcpy(s->name, "Alice");\n' +
          '    s->age = 20;\n' +
          '    s->grade = 88.5;\n' +
          '    printf("Name: %s\\n", s->name);\n' +
          '    printf("Age: %d\\n", s->age);\n' +
          '    printf("Grade: %.1f\\n", s->grade);\n' +
          '    free(s);\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "Name: Alice\nAge: 20\nGrade: 88.5\n",
      },
      {
        id: 39,
        topicExerciseNum: 4,
        title: 'Sort students by grade',
        description: 'Sort an array of `Student` structs by `grade` in ascending order using bubble sort. Print before and after.',
        seedSql: '',
        skeleton: SKELETON_STRING,
        concept:
          'Sorting structs works like sorting primitives — compare a specific field.<br><br>' +
          '<strong>Bubble sort for structs:</strong><br>' +
          '<code>if (students[j].grade > students[j+1].grade) {</code><br>' +
          '<code>    Student t = students[j];</code><br>' +
          '<code>    students[j] = students[j+1];</code><br>' +
          '<code>    students[j+1] = t;</code><br>' +
          '<code>}</code><br><br>' +
          'The whole struct is swapped (copy), not just the grade field.',
        hints: [
          'To sort by grade, what field do you compare in the if condition?',
          'When swapping two structs in the array, do you swap individual fields or whole structs?',
          'What loop structure performs bubble sort on an array of size n?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '#include <string.h>\n' +
          '\n' +
          'typedef struct {\n' +
          '    char name[50];\n' +
          '    int age;\n' +
          '    float grade;\n' +
          '} Student;\n' +
          '\n' +
          'int main() {\n' +
          '    Student students[] = {\n' +
          '        {"Alice", 20, 88.5},\n' +
          '        {"Bob", 19, 72.0},\n' +
          '        {"Charlie", 21, 91.0},\n' +
          '        {"Diana", 20, 85.0},\n' +
          '        {"Eve", 18, 79.5}\n' +
          '    };\n' +
          '    int n = sizeof(students) / sizeof(students[0]);\n' +
          '    for (int i = 0; i < n - 1; i++) {\n' +
          '        for (int j = 0; j < n - 1 - i; j++) {\n' +
          '            if (students[j].grade > students[j + 1].grade) {\n' +
          '                Student t = students[j];\n' +
          '                students[j] = students[j + 1];\n' +
          '                students[j + 1] = t;\n' +
          '            }\n' +
          '        }\n' +
          '    }\n' +
          '    for (int i = 0; i < n; i++) {\n' +
          '        printf("%s\\t%.1f\\n", students[i].name, students[i].grade);\n' +
          '    }\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "Bob\t72.0\nEve\t79.5\nDiana\t85.0\nAlice\t88.5\nCharlie\t91.0\n",
      },
      {
        id: 40,
        topicExerciseNum: 5,
        title: 'Embedded struct (Date in Student)',
        description: 'Create a `Date` struct with `day`, `month`, `year`. Embed it inside `Student`. Create a student, set fields including date, and print the full record.',
        seedSql: '',
        skeleton: SKELETON_STRING,
        concept:
          'Structs can contain other structs as fields (composition).<br><br>' +
          '<strong>Definition:</strong><br>' +
          '<code>typedef struct { int day, month, year; } Date;</code><br><br>' +
          '<code>typedef struct {</code><br>' +
          '<code>    char name[50];</code><br>' +
          '<code>    Date birthDate;</code><br>' +
          '<code>    float grade;</code><br>' +
          '<code>} Student;</code><br><br>' +
          '<strong>Access:</strong><br>' +
          '<code>s.birthDate.year = 2004;</code><br>' +
          'Nesting can go as deep as needed.',
        hints: [
          'How do you access the day field of a Date that is embedded inside a Student?',
          'What operator chains the access from Student to Date to field?',
          'When initializing, do you set s.birthDate as a whole or set its individual fields?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '#include <string.h>\n' +
          '\n' +
          'typedef struct {\n' +
          '    int day, month, year;\n' +
          '} Date;\n' +
          '\n' +
          'typedef struct {\n' +
          '    char name[50];\n' +
          '    Date birthDate;\n' +
          '    float grade;\n' +
          '} Student;\n' +
          '\n' +
          'int main() {\n' +
          '    Student s;\n' +
          '    strcpy(s.name, "Alice");\n' +
          '    s.birthDate.day = 15;\n' +
          '    s.birthDate.month = 3;\n' +
          '    s.birthDate.year = 2004;\n' +
          '    s.grade = 88.5;\n' +
          '    printf("Name: %s\\n", s.name);\n' +
          '    printf("DOB: %d/%d/%d\\n", s.birthDate.day, s.birthDate.month, s.birthDate.year);\n' +
          '    printf("Grade: %.1f\\n", s.grade);\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "Name: Alice\nDOB: 15/3/2004\nGrade: 88.5\n",
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
        description: 'Write 5 lines of text to a file called `output.txt` using `fprintf`. Each line should contain a different message.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          '<strong>fprintf</strong> writes formatted text to a file.<br><br>' +
          '<strong>Pattern:</strong><br>' +
          '<code>FILE* f = fopen("output.txt", "w");</code><br>' +
          '<code>if (!f) { printf("Error\\n"); return 1; }</code><br>' +
          '<code>fprintf(f, "Line 1: ...\\n");</code><br>' +
          '<code>fclose(f);</code><br><br>' +
          '<strong>Modes:</strong><br>' +
          '<code>"w"</code> — write (creates or overwrites)<br>' +
          '<code>"a"</code> — append<br>' +
          '<code>"r"</code> — read',
        hints: [
          'What function opens a file and returns a FILE* pointer?',
          'What mode string creates a new file for writing or overwrites an existing one?',
          'What function closes a file and flushes any buffered data?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    FILE* f = fopen("output.txt", "w");\n' +
          '    if (!f) { printf("Error opening file\\n"); return 1; }\n' +
          '    fprintf(f, "Line 1: Hello\\n");\n' +
          '    fprintf(f, "Line 2: World\\n");\n' +
          '    fprintf(f, "Line 3: This\\n");\n' +
          '    fprintf(f, "Line 4: Is\\n");\n' +
          '    fprintf(f, "Line 5: C\\n");\n' +
          '    fclose(f);\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "",
      },
      {
        id: 42,
        topicExerciseNum: 2,
        title: 'Read file line by line',
        description: 'Open a text file for reading and print each line to the console using `fgets`. Print all lines until EOF.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          '<strong>fgets</strong> reads one line at a time from a file.<br><br>' +
          '<strong>Signature:</strong><br>' +
          '<code>char* fgets(char* buf, int size, FILE* stream);</code><br><br>' +
          '<strong>Pattern:</strong><br>' +
          '<code>char line[256];</code><br>' +
          '<code>while (fgets(line, sizeof(line), f)) {</code><br>' +
          '<code>    printf("%s", line);</code><br>' +
          '<code>}</code><br><br>' +
          '<strong>Returns:</strong> NULL when EOF is reached or an error occurs.',
        hints: [
          'What function reads a line from a file into a buffer?',
          'What does fgets return when it reaches the end of the file?',
          'How do you loop through all lines in a file until EOF?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    FILE* f = fopen("output.txt", "r");\n' +
          '    if (!f) { printf("Error opening file\\n"); return 1; }\n' +
          '    char line[256];\n' +
          '    while (fgets(line, sizeof(line), f)) {\n' +
          '        printf("%s", line);\n' +
          '    }\n' +
          '    fclose(f);\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "Line 1: Hello\nLine 2: World\nLine 3: This\nLine 4: Is\nLine 5: C\n",
      },
      {
        id: 43,
        topicExerciseNum: 3,
        title: 'Count lines in a file',
        description: 'Open a file for reading and count how many lines it contains. Print the line count.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          'Counting lines means counting newline characters.<br><br>' +
          '<strong>Pattern:</strong><br>' +
          '<code>int count = 0;</code><br>' +
          '<code>char line[256];</code><br>' +
          '<code>while (fgets(line, sizeof(line), f)) count++;</code><br>' +
          '<code>printf("Line count: %d\\n", count);</code><br><br>' +
          'Each call to fgets reads exactly one line (including the final newline).',
        hints: [
          'How does fgets know when one line ends?',
          'What simple counter pattern tracks how many lines have been read?',
          'If a file has 5 lines, how many times does fgets return non-NULL?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    FILE* f = fopen("output.txt", "r");\n' +
          '    if (!f) { printf("Error opening file\\n"); return 1; }\n' +
          '    int count = 0;\n' +
          '    char line[256];\n' +
          '    while (fgets(line, sizeof(line), f)) count++;\n' +
          '    fclose(f);\n' +
          '    printf("Line count: %d\\n", count);\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "Line count: 5\n",
      },
      {
        id: 44,
        topicExerciseNum: 4,
        title: 'Copy file byte by byte',
        description: 'Open one file for reading and another for writing. Copy all bytes from one to the other using `fgetc` and `fputc`.',
        seedSql: '',
        skeleton: SKELETON,
        concept:
          'Character-by-character file copy.<br><br>' +
          '<strong>Pattern:</strong><br>' +
          '<code>int ch;</code><br>' +
          '<code>while ((ch = fgetc(src)) != EOF) {</code><br>' +
          '<code>    fputc(ch, dest);</code><br>' +
          '<code>}</code><br><br>' +
          '<strong>fgetc</strong> reads one char/byte. Returns <code>EOF</code> (-1) at end.<br>' +
          '<strong>fputc</strong> writes one char/byte to the output file.<br><br>' +
          '<strong>Important:</strong> <code>ch</code> must be <code>int</code>, not <code>char</code>, to distinguish EOF from valid data.',
        hints: [
          'What function reads a single character from a file?',
          'What value indicates the end of the file has been reached?',
          'What function writes a single character to a file?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '\n' +
          'int main() {\n' +
          '    FILE* src = fopen("output.txt", "r");\n' +
          '    if (!src) { printf("Error opening source\\n"); return 1; }\n' +
          '    FILE* dest = fopen("copy.txt", "w");\n' +
          '    if (!dest) { printf("Error opening dest\\n"); fclose(src); return 1; }\n' +
          '    int ch;\n' +
          '    while ((ch = fgetc(src)) != EOF) fputc(ch, dest);\n' +
          '    fclose(src);\n' +
          '    fclose(dest);\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "",
      },
      {
        id: 45,
        topicExerciseNum: 5,
        title: 'CSV struct I/O',
        description: 'Write 5 `Student` structs to a CSV file (comma-separated values), then read them back and print the records.',
        seedSql: '',
        skeleton: SKELETON_STRING,
        concept:
          'CSV is a simple text format for tabular data.<br><br>' +
          '<strong>Writing CSV with fprintf:</strong><br>' +
          '<code>fprintf(f, "%s,%d,%.1f\\n", s.name, s.age, s.grade);</code><br><br>' +
          '<strong>Reading CSV with fscanf:</strong><br>' +
          '<code>fscanf(f, "%49[^,],%d,%f\\n", s.name, &s.age, &s.grade);</code><br>' +
          'The <code>%49[^,]</code> format reads up to 49 characters until the comma.<br><br>' +
          'CSV is human-readable and importable by spreadsheet software.',
        hints: [
          'What fprintf format would write name, age, and grade separated by commas?',
          'How do you read a string that contains commas using fscanf?',
          'What loop reads records from a CSV file until EOF?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '#include <string.h>\n' +
          '\n' +
          'typedef struct {\n' +
          '    char name[50];\n' +
          '    int age;\n' +
          '    float grade;\n' +
          '} Student;\n' +
          '\n' +
          'int main() {\n' +
          '    Student students[] = {\n' +
          '        {"Alice", 20, 88.5},\n' +
          '        {"Bob", 19, 72.0},\n' +
          '        {"Charlie", 21, 91.0},\n' +
          '        {"Diana", 20, 85.0},\n' +
          '        {"Eve", 18, 79.5}\n' +
          '    };\n' +
          '    FILE* f = fopen("students.csv", "w");\n' +
          '    for (int i = 0; i < 5; i++)\n' +
          '        fprintf(f, "%s,%d,%.1f\\n", students[i].name, students[i].age, students[i].grade);\n' +
          '    fclose(f);\n' +
          '\n' +
          '    f = fopen("students.csv", "r");\n' +
          '    Student s;\n' +
          '    while (fscanf(f, "%49[^,],%d,%f\\n", s.name, &s.age, &s.grade) == 3)\n' +
          '        printf("%s\\t%d\\t%.1f\\n", s.name, s.age, s.grade);\n' +
          '    fclose(f);\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "Alice\t20\t88.5\nBob\t19\t72.0\nCharlie\t21\t91.0\nDiana\t20\t85.0\nEve\t18\t79.5\n",
      },
    ],
  },
  {
    id: 10,
    title: 'Pointer-based Queue',
    exercises: [
      {
        id: 46,
        topicExerciseNum: 1,
        title: 'Create and free a single node',
        description: 'Define a `Node` struct with `int value` and `Node* next`. `malloc` one node, set its value to 42, print it, then `free` it.',
        seedSql: '',
        skeleton: SKELETON_STDLIB,
        concept:
          'A linked list node holds data and a pointer to the next node.<br><br>' +
          '<strong>Node definition:</strong><br>' +
          '<code>typedef struct Node {</code><br>' +
          '<code>    int value;</code><br>' +
          '<code>    struct Node* next;</code><br>' +
          '<code>} Node;</code><br><br>' +
          '<strong>Why <code>struct Node*</code> inside?</strong> The <code>typedef</code> name isn\'t available yet inside the struct, so you must use <code>struct Node*</code> for the <code>next</code> field.',
        hints: [
          'What two fields does a singly linked list node have?',
          'Inside the struct definition, why use struct Node* instead of just Node* for the next field?',
          'What function allocates a new node on the heap?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '#include <stdlib.h>\n' +
          '\n' +
          'typedef struct Node {\n' +
          '    int value;\n' +
          '    struct Node* next;\n' +
          '} Node;\n' +
          '\n' +
          'int main() {\n' +
          '    Node* n = (Node*)malloc(sizeof(Node));\n' +
          '    n->value = 42;\n' +
          '    n->next = NULL;\n' +
          '    printf("Node value: %d\\n", n->value);\n' +
          '    free(n);\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "Node value: 42\n",
      },
      {
        id: 47,
        topicExerciseNum: 2,
        title: 'Enqueue function',
        description: 'Write `void enqueue(Node **head, Node **tail, int val)` that adds a node to the back of the queue. Handle the empty-queue case.',
        seedSql: '',
        skeleton: SKELETON_STDLIB_FUNC,
        concept:
          'Enqueue adds to the rear of the queue.<br><br>' +
          '<strong>Algorithm:</strong><br>' +
          '1. Create a new node with the value and <code>next = NULL</code><br>' +
          '2. If queue is empty (<code>*head == NULL</code>): set both head and tail to the new node<br>' +
          '3. Else: link the current tail to the new node (<code>(*tail)->next = newNode</code>), then update tail<br><br>' +
          '<strong>Double pointers:</strong> We need <code>Node**</code> because the function modifies the head/tail pointers themselves.',
        hints: [
          'When enqueuing to an empty queue, which pointers need to change?',
          'When enqueuing to a non-empty queue, what link do you set before updating tail?',
          'Why are the parameters Node** instead of Node*?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '#include <stdlib.h>\n' +
          '\n' +
          'typedef struct Node {\n' +
          '    int value;\n' +
          '    struct Node* next;\n' +
          '} Node;\n' +
          '\n' +
          'void enqueue(Node** head, Node** tail, int val) {\n' +
          '    Node* n = (Node*)malloc(sizeof(Node));\n' +
          '    n->value = val;\n' +
          '    n->next = NULL;\n' +
          '    if (*head == NULL) {\n' +
          '        *head = *tail = n;\n' +
          '    } else {\n' +
          '        (*tail)->next = n;\n' +
          '        *tail = n;\n' +
          '    }\n' +
          '}\n' +
          '\n' +
          'int main() {\n' +
          '    Node* head = NULL, *tail = NULL;\n' +
          '    enqueue(&head, &tail, 10);\n' +
          '    enqueue(&head, &tail, 20);\n' +
          '    printf("Enqueued values\\n");\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "Enqueued values\n",
      },
      {
        id: 48,
        topicExerciseNum: 3,
        title: 'Dequeue function',
        description: 'Write `int dequeue(Node **head, Node **tail)` that removes a node from the front of the queue and returns its value. Handle the empty-queue case (return -1).',
        seedSql: '',
        skeleton: SKELETON_STDLIB_FUNC,
        concept:
          'Dequeue removes from the front of the queue.<br><br>' +
          '<strong>Algorithm:</strong><br>' +
          '1. If empty, return -1 (or some sentinel)<br>' +
          '2. Save the front node<br>' +
          '3. Move head to the next node<br>' +
          '4. If head becomes NULL, set tail to NULL too (queue now empty)<br>' +
          '5. Save the value, free the old node, return the value<br><br>' +
          '<strong>Edge case:</strong> Single element — after dequeue, both head and tail become NULL.',
        hints: [
          'What should dequeue return if the queue is empty?',
          'After removing the front node, how do you update head?',
          'After dequeuing the last element, what should both head and tail be set to?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '#include <stdlib.h>\n' +
          '\n' +
          'typedef struct Node {\n' +
          '    int value;\n' +
          '    struct Node* next;\n' +
          '} Node;\n' +
          '\n' +
          'int dequeue(Node** head, Node** tail) {\n' +
          '    if (*head == NULL) return -1;\n' +
          '    Node* t = *head;\n' +
          '    int val = t->value;\n' +
          '    *head = t->next;\n' +
          '    if (*head == NULL) *tail = NULL;\n' +
          '    free(t);\n' +
          '    return val;\n' +
          '}\n' +
          '\n' +
          'int main() {\n' +
          '    Node* head = NULL, *tail = NULL;\n' +
          '    enqueue(&head, &tail, 10);\n' +
          '    enqueue(&head, &tail, 20);\n' +
          '    printf("Dequeued: %d\\n", dequeue(&head, &tail));\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "Dequeued: 10\n",
      },
      {
        id: 49,
        topicExerciseNum: 4,
        title: 'Print queue function',
        description: 'Write `void print_queue(Node *head)` that traverses the queue from front to back, printing each value. Show "NULL" at the end.',
        seedSql: '',
        skeleton: SKELETON_FUNC,
        concept:
          'Traverse a linked list by following next pointers.<br><br>' +
          '<strong>Pattern:</strong><br>' +
          '<code>while (head) {</code><br>' +
          '<code>    printf("%d -> ", head->value);</code><br>' +
          '<code>    head = head->next;</code><br>' +
          '<code>}</code><br>' +
          '<code>printf("NULL\\n");</code><br><br>' +
          'The function receives the head by value — modifying <code>head</code> inside the function does NOT affect the caller\'s head pointer.',
        hints: [
          'What condition keeps the traversal loop running?',
          'How do you advance from one node to the next?',
          'After the loop ends, what string do you print to show the end of the list?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '#include <stdlib.h>\n' +
          '\n' +
          'typedef struct Node {\n' +
          '    int value;\n' +
          '    struct Node* next;\n' +
          '} Node;\n' +
          '\n' +
          'void print_queue(Node* head) {\n' +
          '    while (head) {\n' +
          '        printf("%d -> ", head->value);\n' +
          '        head = head->next;\n' +
          '    }\n' +
          '    printf("NULL\\n");\n' +
          '}\n' +
          '\n' +
          'int main() {\n' +
          '    Node* head = NULL, *tail = NULL;\n' +
          '    enqueue(&head, &tail, 10);\n' +
          '    enqueue(&head, &tail, 20);\n' +
          '    enqueue(&head, &tail, 30);\n' +
          '    print_queue(head);\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "10 -> 20 -> 30 -> NULL\n",
      },
      {
        id: 50,
        topicExerciseNum: 5,
        title: 'Menu-driven queue program',
        description: 'Build a menu-driven program with options: enqueue, dequeue, peek (view front without removing), print, and quit. Free all nodes on exit.',
        seedSql: '',
        skeleton:
          '#include <stdio.h>\n' +
          '#include <stdlib.h>\n' +
          '\n' +
          '\n' +
          'int main() {\n' +
          '    \n' +
          '    return 0;\n' +
          '}',
        inputHint: 'Enter menu choices and values (integers)',
        concept:
          'A menu-driven program combines all queue operations into an interactive interface.<br><br>' +
          '<strong>Pattern:</strong><br>' +
          '<code>do {</code><br>' +
          '<code>    printf("1) Enqueue 2) Dequeue 3) Peek 4) Print 5) Quit\\n");</code><br>' +
          '<code>    printf("Choice: "); scanf("%d", &choice);</code><br>' +
          '<code>    switch (choice) { ... }</code><br>' +
          '<code>} while (choice != 5);</code><br><br>' +
          '<strong>Cleanup:</strong> Before quitting, loop through the list and free every node to prevent memory leaks.',
        hints: [
          'What loop structure keeps showing the menu until the user chooses to quit?',
          'How do you free all remaining nodes when the user quits?',
          'Peek shows the front value without removing it — what condition handles an empty queue?',
        ],
        answer:
          '#include <stdio.h>\n' +
          '#include <stdlib.h>\n' +
          '\n' +
          'typedef struct Node {\n' +
          '    int value;\n' +
          '    struct Node* next;\n' +
          '} Node;\n' +
          '\n' +
          'void enqueue(Node** head, Node** tail, int val) {\n' +
          '    Node* n = (Node*)malloc(sizeof(Node));\n' +
          '    n->value = val; n->next = NULL;\n' +
          '    if (!*head) { *head = *tail = n; }\n' +
          '    else { (*tail)->next = n; *tail = n; }\n' +
          '}\n' +
          '\n' +
          'int dequeue(Node** head, Node** tail) {\n' +
          '    if (!*head) return -1;\n' +
          '    Node* t = *head;\n' +
          '    int v = t->value;\n' +
          '    *head = t->next;\n' +
          '    if (!*head) *tail = NULL;\n' +
          '    free(t);\n' +
          '    return v;\n' +
          '}\n' +
          '\n' +
          'void print_queue(Node* head) {\n' +
          '    while (head) { printf("%d ", head->value); head = head->next; }\n' +
          '    printf("\\n");\n' +
          '}\n' +
          '\n' +
          'void free_all(Node** head) {\n' +
          '    while (*head) { Node* t = *head; *head = (*head)->next; free(t); }\n' +
          '}\n' +
          '\n' +
          'int main() {\n' +
          '    Node* head = NULL, *tail = NULL;\n' +
          '    int choice, val;\n' +
          '    do {\n' +
          '        printf("1)Enqueue 2)Dequeue 3)Peek 4)Print 5)Quit: ");\n' +
          '        scanf("%d", &choice);\n' +
          '        switch (choice) {\n' +
          '            case 1: printf("Value: "); scanf("%d", &val); enqueue(&head, &tail, val); break;\n' +
          '            case 2: val = dequeue(&head, &tail); if (val == -1) printf("Empty\\n"); else printf("Got %d\\n", val); break;\n' +
          '            case 3: if (head) printf("Front: %d\\n", head->value); else printf("Empty\\n"); break;\n' +
          '            case 4: print_queue(head); break;\n' +
          '            case 5: free_all(&head); printf("Goodbye\\n"); break;\n' +
          '            default: printf("Invalid\\n");\n' +
          '        }\n' +
          '    } while (choice != 5);\n' +
          '    return 0;\n' +
          '}',
        expectedOutput: "1)Enqueue 2)Dequeue 3)Peek 4)Print 5)Quit: Goodbye\n",
      },
    ],
  },
]

export const EXERCISES = TOPICS.flatMap(t => t.exercises)

export function checkCompletion(exercise, code, error) {
  if (error) return false
  if (!exercise) return false
  switch (exercise.id) {
    case 1:
      return /\bint\s+\w+\s*=\s*42\b/.test(code) && /\bprintf\b/.test(code)
    case 2:
      return /\bfloat\s+\w+\s*=/.test(code) && /\/\s*2\.0/.test(code) && /\bprintf\b/.test(code)
    case 3:
      return /\w+\s*=\s*\w+\s*[+^]\s*\w+/.test(code) && /\bprintf\b/.test(code)
    case 4:
      return /\bsizeof\s*\(\s*int\s*\)/.test(code) && /\bsizeof\s*\(\s*char\s*\)/.test(code) && /\bprintf\b/.test(code)
    case 5:
      return /2147483647/.test(code) && /\bprintf\b/.test(code)
    case 6:
      return /[+\-*/%]/.test(code) && /\bprintf\b/.test(code) && /(sum|difference|product|quotient|remainder)/i.test(code)
    case 7:
      return /9\s*\.\s*0\s*\/\s*5\s*\.\s*0/.test(code) && /32/.test(code) && /\bprintf\b/.test(code)
    case 8:
      return /%\s*2/.test(code) && /(even|odd)/i.test(code)
    case 9:
      return /\b(\+=|-=|\*=|(\/=))\b/.test(code) && /\bprintf\b/.test(code)
    case 10:
      return /[&|^]/.test(code) && /\bprintf\b/.test(code) && /(AND|OR|XOR)/i.test(code)
    case 11:
      return /\b(if|else\s+if|else)\b/.test(code) && /(>=|<=|==)/.test(code) && /\bprintf\b/.test(code)
    case 12:
      return /\b(for|while)\b/.test(code) && /(Fizz|Buzz)/i.test(code) && /%\s*(3|5|15)/.test(code)
    case 13:
      return /\bfor\b/.test(code) && /\bfor\b[\s\S]*\bfor\b/.test(code) && /\*/.test(code) && /\bprintf\b/.test(code)
    case 14:
      return /\b(srand|rand)\b/.test(code) && /\b(do|while)\b/.test(code) && /\bscanf\b/.test(code)
    case 15:
      return /%\s*2/.test(code) && /\*3\s*\+1|\*3\s*\+\s*1/.test(code) && /\bwhile\b/.test(code)
    case 16:
      return /\bint\s+power\s*\(/.test(code) && /\bfor\b/.test(code) && /\breturn\b/.test(code)
    case 17:
      return /\bint\s+isPrime\s*\(/.test(code) && /%\s*i\s*==\s*0/.test(code) && /\breturn\b/.test(code)
    case 18:
      return /\bint\s+factorial\s*\(/.test(code) && /factorial\s*\(/.test(code) && /\breturn\b/.test(code)
    case 19:
      return /\b(findMin|findMax)\s*\(/.test(code) && /\bint\s+\w+\s*\[\s*\]/.test(code) && /\breturn\b/.test(code)
    case 20:
      return /\bchar\s+encode\s*\(/.test(code) && /%\s*26/.test(code) && /\breturn\b/.test(code)
    case 21:
      return /\bint\s+\w+\s*\[\s*10\s*\]/.test(code) && /(sum|average)/i.test(code) && /\bprintf\b/.test(code)
    case 22:
      return /\bfor\b[\s\S]*\bfor\b/.test(code) && /\[l\]|\[r\]|\[left\]|\[right\]/.test(code) && /(Before|After)/i.test(code)
    case 23:
      return /\bint\s+search\s*\(/.test(code) && /\breturn\s+-1\b/.test(code) && /\bprintf\b/.test(code)
    case 24:
      return /\bfor\b[\s\S]*\bfor\b/.test(code) && /\[j\]\s*>\s*\[j\s*\+\s*1\]/.test(code) && /(Before|After)/i.test(code)
    case 25:
      return /\bint\s+\w+\s*\[\s*3\s*\]\s*\[\s*3\s*\]/.test(code) && /\[i\]\s*\[\s*k\s*\]\s*\*\s*\w+\s*\[\s*k\s*\]\s*\[\s*j\s*\]/.test(code) && /\bprintf\b/.test(code)
    case 26:
      return /\\0/.test(code) && /[\s\S]*\\0/.test(code) && /\bprintf\b/.test(code)
    case 27:
      return /\*\s*\w+\s*=\s*\*\s*\w+/.test(code) && /\bwhile\b/.test(code)
    case 28:
      return /\b(vowel|VOWEL|a.*e.*i.*o.*u)/i.test(code) && /\bfor\b/.test(code) && /\bprintf\b/.test(code)
    case 29:
      return /\bint\s+isPalindrome\s*\(/.test(code) && /\bwhile\b/.test(code) && /\breturn\b/.test(code)
    case 30:
      return /\binWord/u.test(code) && /\bprintf\b/.test(code)
    case 31:
      return /&\w+/.test(code) && /\*\s*\w+\s*=\s*\d+/.test(code) && /\bprintf\b/.test(code)
    case 32:
      return /\bvoid\s+swap\s*\(/.test(code) && /\*\s*\w+\s*=\s*/.test(code) && /\bprintf\b/.test(code)
    case 33:
      return /\*\s*\w+\s*\+\+/.test(code) && /\bfor\b/.test(code) && /\bprintf\b/.test(code)
    case 34:
      return /\bmalloc\s*\(/.test(code) && /\bfree\s*\(/.test(code) && /\bprintf\b/.test(code)
    case 35:
      return /\bchar\s*\*\*\s*\w+\s*=\s*\(?\s*char\s*\*\*\s*\)?\s*malloc/.test(code) && /\bfree\b/.test(code) && /\bprintf\b/.test(code)
    case 36:
      return /\btypedef\b/.test(code) && /\bstruct\b/.test(code) && /\bprintf\b/.test(code)
    case 37:
      return /\bstruct\b/.test(code) && /\[\s*5\s*\]/.test(code) && /\bprintf\b/.test(code)
    case 38:
      return /\bmalloc\s*\(/.test(code) && /->/.test(code) && /\bfree\b/.test(code)
    case 39:
      return /\bstruct\b/.test(code) && /\.grade/.test(code) && /\bfor\b[\s\S]*\bfor\b/.test(code)
    case 40:
      return /\bstruct\b[\s\S]*\bstruct\b/.test(code) && /\..*\./.test(code) && /\bprintf\b/.test(code)
    case 41:
      return /\bfopen\s*\(/.test(code) && /\bfprintf\b/.test(code) && /\bfclose\b/.test(code)
    case 42:
      return /\bfopen\s*\(.*"r"/.test(code) && /\bfgets\b/.test(code) && /\bprintf\b/.test(code)
    case 43:
      return /\bfopen\s*\(/.test(code) && /\bfgets\b/.test(code) && /count\b/.test(code)
    case 44:
      return /\bfgetc\b/.test(code) && /\bfputc\b/.test(code) && /\bEOF\b/.test(code)
    case 45:
      return /\bfprintf\b/.test(code) && /\bfscanf\b/.test(code) && /\bstruct\b/.test(code)
    case 46:
      return /\btypedef\b/.test(code) && /\bstruct\s+Node\b/.test(code) && /\bfree\b/.test(code)
    case 47:
      return /\bvoid\s+enqueue\s*\(/.test(code) && /\*\*\s*\w+\s*,\s*\*\*\s*\w+/.test(code) && /\bmalloc\b/.test(code)
    case 48:
      return /\bint\s+dequeue\s*\(/.test(code) && /\*\*\s*\w+\s*,\s*\*\*\s*\w+/.test(code) && /\bfree\b/.test(code)
    case 49:
      return /\bvoid\s+print_queue\s*\(/.test(code) && /\bwhile\b/.test(code) && /\bprintf\b/.test(code)
    case 50:
      return /\bswitch\b/.test(code) && /\b(enqueue|dequeue)\b/.test(code) && /\b(free|free_all)\b/.test(code)
    default:
      return false
  }
}
