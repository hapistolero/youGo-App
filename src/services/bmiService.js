function getUserBmi(height, weight) {
  const bmi = Number(weight) / ((Number(height) / 100) * (Number(height) / 100))
  
  let status
  
  if (bmi < 16) {
    status = 'severe thinness'
  } else if (bmi >= 16 && bmi <= 17) {
    status = 'moderate thinness'
  } else if (bmi > 17 && bmi <= 18.5) {
    status = 'mild thinness'
  } else if (bmi > 18.5 && bmi <= 25) {
    status = 'normal'
  } else if (bmi > 25 && bmi <= 30) {
    status = 'overweight'
  } else if (bmi > 30 && bmi <= 35) {
    status = 'obese class 1'
  } else if (bmi > 35 && bmi <= 40) {
    status = 'obese class 2'
  } else {
    status = 'obese class 3'
  }
  
  // Calculate ideal weight range
  const idealWeightMin = 18.5 * (Number(height) / 100) ** 2
  const idealWeightMax = 25 * (Number(height) / 100) ** 2
  const idealWeight = `${idealWeightMin.toFixed(2)} kg - ${idealWeightMax.toFixed(2)} kg`
  return {
    bmi: bmi.toFixed(2),
    status,
    idealWeight,
  }
}
  

module.exports = getUserBmi