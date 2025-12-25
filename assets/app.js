async function main() {
  const app = document.getElementById("app");
  app.innerHTML = `<p class="muted">Đang tải danh sách bài tập...</p>`;

  try {
    const res = await fetch("manifest.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const sessions = data.sessions || [];
    if (!sessions.length) {
      app.innerHTML = `<p class="muted">Chưa có bài tập nào trong exercises/ hoặc manifest chưa được tạo.</p>`;
      return;
    }

    app.innerHTML = sessions.map(group => {
      const cards = (group.items || []).map(it => {
        const label = `${group.session} - ${it.title}`;
        const url = `viewer.html?file=${encodeURIComponent(it.file)}&label=${encodeURIComponent(label)}`;
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
            <p class="muted">${(group.items || []).length} bài</p>
          </div>
          <div class="task-grid">${cards}</div>
        </section>
      `;
    }).join("");
  } catch (e) {
    app.innerHTML = `<p class="muted">Lỗi tải manifest.json: ${String(e.message || e)}</p>`;
  }
}

main();
