const DATA = [
  {
    session: "Session 1",
    items: [
      { title: "BT 1", file: "exercises/s1-bt1.html" },
      { title: "BT 2", file: "exercises/s1-bt2.html" },
    ],
  },
  {
    session: "Session 2",
    items: [
      { title: "BT 1", file: "exercises/s2-bt1.html" },
    ],
  },
];

const app = document.getElementById("app");

app.innerHTML = DATA.map(group => {
  const cards = group.items.map(it => {
    const url = `viewer.html?file=${encodeURIComponent(it.file)}&label=${encodeURIComponent(group.session + " - " + it.title)}`;
    return `
      <a class="task-card" href="${url}">
        <div class="task-title">${it.title}</div>
        <div class="task-sub">${it.file}</div>
      </a>
    `;
  }).join("");

  return `
    <section class="session">
      <div class="session-header">
        <h2>${group.session}</h2>
      </div>
      <div class="task-grid">
        ${cards}
      </div>
    </section>
  `;
}).join("");
