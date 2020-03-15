const getAverage = (array) =>
  parseFloat((array.reduce((a, b) => a + b, 0) / array.length).toFixed(2))

export default (agent) => {
  let taskCategoryMap = {}
  agent.tasks.forEach(task => {
    taskCategoryMap[task.category] = taskCategoryMap[task.category] || []
    taskCategoryMap[task.category].push(task.score)
  })

  agent.categories = []
  const categoryNames = Object.keys(taskCategoryMap)
  categoryNames.forEach(categoryName => {
    agent.categories.push({
      name: categoryName,
      avg: getAverage(taskCategoryMap[categoryName])
    })
  })
}