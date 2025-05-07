export const defaultPrompts = [
  "What’s your name?",
  "What do you like?",
  "Say 3 fruits.",
  "Ask your friend a question.",
  "What day is it today?",
  "What animal do you like?",
  "Say the alphabet from A to E.",
  "What’s your favorite color?",
  "Say 3 things you see.",
];

export const promptCategories: { [key: string]: string[] } = {
  Animals: [
    "What animal do you like?",
    "Can you make an animal sound?",
    "Name 3 animals.",
    "What animal is big?",
    "What's your favorite animal?",
  ],
  Food: [
    "What food do you like?",
    "Name 3 fruits.",
    "Do you like sushi?",
    "What's your favorite snack?",
    "Say a fruit that starts with A.",
  ],
  Colors: [
    "What's your favorite color?",
    "Name 3 colors.",
    "What color is the sky?",
    "What color do you see?",
    "Say the colors of the rainbow.",
  ],
  "Do you like...?": [
    "Do you like dogs?",
    "Do you like pizza?",
    "Do you like math?",
    "Do you like ice cream?",
    "Do you like English class?",
  ],
  Alphabet: [
    "Say the alphabet from A to E.",
    "Say the alphabet backwards from D.",
    "What letter comes after C?",
    "Can you say your ABCs?",
    "Spell your name.",
  ],
  Default: defaultPrompts,
};
