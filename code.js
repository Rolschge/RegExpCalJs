function dateformatter(currentDate) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return (
    currentDate.getDate() +
    "/" +
    months[currentDate.getMonth()] +
    "/" +
    currentDate.getFullYear()
  );
}

async function analyze(text) {
  const apiKey = "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";
  const headers = {
    Authorization: "Bearer " + apiKey,
    "Content-Type": "application/json",
  };

  const prompt =
    "Return all events in the text as table with columns start date, start time, end date, end time, whole day event, summary and full description. " +
    "Show all dates in ISO-Format. The current date is " +
    dateformatter(new Date()) +
    ". Return only the table.\n\n" +
    text;

  const data = {
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0,
    max_tokens: 1000,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  };
  console.log(prompt);

  const body = JSON.stringify(data);
  const url = "https://api.openai.com/v1/completions";
  var response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: body,
  });

  return response.json();
}


function toICal(input) {
    const lines = input.split('\n');
    let output = 'BEGIN:VCALENDAR\nVERSION:2.0\n';
    for (let i = 2; i < lines.length; i++) {
        const line = lines[i].split('|').map(x => x.trim());
        if (line.length < 7) continue;
        const [startDate, startTime, endDate, endTime, wholeDayEvent, summary, description] = line.slice(1, 8);
        output += 'BEGIN:VEVENT\n';
        if (wholeDayEvent === 'Yes') {
            output += `DTSTART;VALUE=DATE:${startDate.split('-').join('')}\n`;
            output += `DTEND;VALUE=DATE:${endDate.split('-').join('')}\n`;
        } else {
            output += `DTSTART;VALUE=DATE:${startDate.split('-').join('')}T${startTime.replace(':', '')}00\n`;
            output += `DTEND;VALUE=DATE:${endDate.split('-').join('')}T${endTime.replace(':', '')}00\n`;
        }
        output += `SUMMARY:${summary}\n`;
        output += `DESCRIPTION:${description}\n`;
        output += 'END:VEVENT\n';
    }
    output += 'END:VCALENDAR\n';
    return output;
}

