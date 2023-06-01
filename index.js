const { DecisionTreeClassifier } = require('ml-cart');
const fs = require('fs');
const readline = require('readline');

// Read the training data from a JSON file
const trainingDataPath = './training_data.json';

// Structure is like
// [ 
 // [mondays data],
 // [tuesdays data],
 // [wednesday data],
 // [thursday data],
 // [friday data]
// ]
const trainingData = JSON.parse(fs.readFileSync(trainingDataPath, 'utf8'));

// Map clothing choices to integer labels
const labelMap = new Map([
  [0, 0],   // Casual top
  [0.5, 1], // Polo
  [1, 2]    // Shirt
]);
const labelToClothesMap = {
  "0.5": 'Polo',
  "1": 'Shirt',
  "0": 'Casual'
}

const trainingDataFormatted = trainingData.map(data => {
  const mappedData = data.slice();
  mappedData[mappedData.length - 1] = labelMap.get(mappedData[mappedData.length - 1]);
  return mappedData;
});

// Prepare the training data
const trainingFeatures = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const X = trainingDataFormatted.map(data => data.slice(0, -1));
const y = trainingDataFormatted.map(data => data[data.length - 1]);

// Train the decision tree classifier
const dt = new DecisionTreeClassifier();
dt.train(X, y, trainingFeatures);

// Predict function
function predictClothing(input) {
  const prediction = dt.predict([input]);
  console.log(prediction)
  let predictedLabel = Array.from(labelMap.keys()).find(key => labelMap.get(key) === prediction[0]) + "";
  return labelToClothesMap[predictedLabel]
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask user for the day to predict
rl.question('Enter the day (Monday, Tuesday, Wednesday, Thursday, Friday): ', (day) => {
  rl.close();

  // Convert user input to lowercase and get the corresponding index
  const dayIndex = trainingFeatures.indexOf(day.trim());

  if (dayIndex < 0) {
    console.log('Invalid day input. Please select a valid day.');
    return;
  }

  // Get the input for the selected day
  const input = trainingData[dayIndex].slice(0, -1);

  const predictedClothing = predictClothing(input);
  console.log(`Based on the given data, Ivan should wear: ${predictedClothing}`);
});
