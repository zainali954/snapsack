function formatDate(dateInput) {
    if (!dateInput) return "N/A"; // Handle null, undefined, or empty values

    let date;
    
    // Ensure it's a number before using it
    if (typeof dateInput === "string" && !isNaN(dateInput)) {
        date = new Date(Number(dateInput));
    } else {
        date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid date cases

    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
}

export default formatDate;