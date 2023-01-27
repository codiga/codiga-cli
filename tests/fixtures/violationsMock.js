const violation1 = {
  filename: "test-file-1.js",
  start: {
    line: 1,
    col: 1,
  },
  end: {
    line: 1,
    col: 1,
  },
  message: "Invalid use of something",
  severity: "WARNING",
  category: "BEST_PRACTICE",
};

const violation2 = {
  filename: "test-file-1.js",
  start: {
    line: 1,
    col: 1,
  },
  end: {
    line: 1,
    col: 1,
  },
  message: "Invalid use of something else",
  severity: "WARNING",
  category: "BEST_PRACTICE",
};

const violation3 = {
  filename: "test-file-2.js",
  start: {
    line: 2,
    col: 2,
  },
  end: {
    line: 2,
    col: 2,
  },
  message: "Invalid use of something",
  severity: "INFORMATIONAL",
  category: "BEST_PRACTICE",
};

export const violationsMock = [violation1, violation2, violation3];

export const violationsText = `Filename - Message (Severity/Category)
test-file-1.js:1:1 - Invalid use of something (WARNING/BEST_PRACTICE)
test-file-1.js:1:1 - Invalid use of something else (WARNING/BEST_PRACTICE)
test-file-2.js:2:2 - Invalid use of something (INFORMATIONAL/BEST_PRACTICE)`;

export const violationsJson = `[
  {
    "filename": "test-file-1.js:1:1",
    "message": "Invalid use of something",
    "severity": "WARNING",
    "category": "BEST_PRACTICE"
  },
  {
    "filename": "test-file-1.js:1:1",
    "message": "Invalid use of something else",
    "severity": "WARNING",
    "category": "BEST_PRACTICE"
  },
  {
    "filename": "test-file-2.js:2:2",
    "message": "Invalid use of something",
    "severity": "INFORMATIONAL",
    "category": "BEST_PRACTICE"
  }
]`;

export const violationsCsv = `File,Message,Severity,Category
test-file-1.js:1:1,Invalid use of something,WARNING,BEST_PRACTICE
test-file-1.js:1:1,Invalid use of something else,WARNING,BEST_PRACTICE
test-file-2.js:2:2,Invalid use of something,INFORMATIONAL,BEST_PRACTICE`;
