import { alertMessages } from "./constants";

/**
 * Calculate the total number of active animals from weekly data
 * @param {Array} weekData - Array of daily animal activity data
 * @returns {number} Total animals
 */
export const calculateTotalAnimals = (weekData) => {
  return weekData.reduce((sum, day) => sum + day.animals, 0);
};

/**
 * Format efficiency value as percentage string
 * @param {number} efficiency - Efficiency value
 * @returns {string} Formatted percentage
 */
export const formatEfficiency = (efficiency) => {
  return `${efficiency}%`;
};

/**
 * Get a random alert message from predefined list
 * Uses alertMessages from constants to avoid duplication
 * @returns {string} Random alert message
 */
export const getRandomAlertMessage = () => {
  return alertMessages[Math.floor(Math.random() * alertMessages.length)];
};

/**
 * Determine alert type based on message content
 * @param {string} message - Alert message
 * @returns {string} Alert type ('warning' or 'info')
 */
export const getAlertType = (message) => {
  if (message.includes("temperature") || message.includes("humidity") || message.includes("critical")) {
    return "warning";
  }
  if (message.includes("completed") || message.includes("scheduled") || message.includes("checkup")) {
    return "info";
  }
  if (message.includes("Low stock") || message.includes("delayed") || message.includes("required")) {
    return "warning";
  }
  return "info";
};

/**
 * Export data to CSV format and trigger download
 * @param {Object} data - Data object containing all export data
 * @param {string} filename - Name of the file to download
 */
export const exportToCSV = (data, filename) => {
  const { zooData, activityData, feedingData, dietData, alerts } = data;

  const csvData = [
    ["Metric", "Value", "Type"],
    ["Total Animals", zooData.population, "Zoo Stats"],
    ["Avg Temperature", zooData.temperature + "°C", "Environment"],
    ["Avg Humidity", zooData.humidity + "%", "Environment"],
    ["Last Updated", zooData.lastUpdated, "System"],
    [""],
    ["Animal Activity Data"],
    ["Period", "Active Animals", "Feedings Completed"],
    ...activityData.map((item) => [item.name, item.animals, item.feedingCompleted]),
    [""],
    ["Feeding Efficiency"],
    ["Period", "Efficiency"],
    ...feedingData.map((item) => [item.name, item.efficiency + "%"]),
    [""],
    ["Diet Distribution"],
    ["Food Type", "Percentage"],
    ...dietData.map((item) => [item.name, item.value + "%"]),
    [""],
    ["Active Alerts"],
    ["Message", "Type", "Time"],
    ...alerts.map((alert) => [alert.message, alert.type, alert.time]),
  ];

  const csvContent = csvData.map((row) => row.map((field) => `"${field}"`).join(",")).join("\n");

  const dataBlob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export data to JSON format and trigger download
 * @param {Object} data - Data object to export
 * @param {string} filename - Name of the file to download
 */
export const exportToJSON = (data, filename) => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate export filename with current date
 * @param {string} extension - File extension (csv or json)
 * @returns {string} Filename with date
 */
export const generateExportFilename = (extension) => {
  return `zoolab-data-${new Date().toISOString().split("T")[0]}.${extension}`;
};
