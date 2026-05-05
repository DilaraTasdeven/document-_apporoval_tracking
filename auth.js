(function () {
  const AUTH_KEY = "onay-zinciri-oturum";
  const ORGANIZATION_KEY = "onay-zinciri-organizasyon";
  const EMPLOYEE_PASSWORDS_KEY = "onay-zinciri-calisan-sifreleri";
  const MANAGER_NAME = "admin";
  const MANAGER_PASSWORD = "12345678";

  const DEFAULT_ORGANIZATION = {
    "Bilgi Teknolojileri": ["Gizem Yaman", "Cenk Ersoy", "Ali Ozkan"],
    "Insan Kaynaklari": ["Derya Korkmaz", "Erdem Cetin", "Melis Ak"],
    "Hukuk": ["Merve Akin", "Levent Saglam", "Seda Ucan"],
    "Idari Isler": ["Buse Kilic", "Sinan Can", "Aylin Ozturk"],
    "Satin Alma": ["Pelin Acar", "Yasemin Duran", "Furkan Demir"],
    "Finans": ["Murat Usta", "Selin Yildiz", "Asli Sonmez"]
  };

  function safeParse(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function normalizeText(value) {
    return String(value || "")
      .trim()
      .toLocaleLowerCase("tr-TR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");
  }

  function normalizePasswordKey(name) {
    return normalizeText(name);
  }

  function generateEmployeePassword() {
    let value = "";
    for (let i = 0; i < 8; i += 1) {
      value += String(Math.floor(Math.random() * 10));
    }
    return value;
  }

  function ensureOrganization() {
    const stored = safeParse(ORGANIZATION_KEY, null);
    const organization = {};

    Object.keys(DEFAULT_ORGANIZATION).forEach((department) => {
      const source = stored && Array.isArray(stored[department])
        ? stored[department]
        : DEFAULT_ORGANIZATION[department];

      organization[department] = Array.from(new Set(
        source
          .map((person) => String(person || "").trim())
          .filter(Boolean)
      ));
    });

    localStorage.setItem(ORGANIZATION_KEY, JSON.stringify(organization));
    return organization;
  }

  function getEmployeeNames() {
    const organization = ensureOrganization();
    const names = new Set();

    Object.values(organization).forEach((people) => {
      if (!Array.isArray(people)) return;
      people.forEach((person) => {
        const clean = String(person || "").trim();
        if (clean) names.add(clean);
      });
    });

    return Array.from(names).sort((a, b) => a.localeCompare(b, "tr"));
  }

  function ensureEmployeePasswords() {
    const names = getEmployeeNames();
    const activeKeys = new Set(names.map(normalizePasswordKey));
    const stored = safeParse(EMPLOYEE_PASSWORDS_KEY, {});
    const passwords = {};

    names.forEach((name) => {
      const key = normalizePasswordKey(name);
      const existing = stored && typeof stored[key] === "string" ? stored[key] : "";
      passwords[key] = /^[A-Za-z0-9]{8}$/.test(existing) ? existing : generateEmployeePassword();
    });

    Object.keys(stored || {}).forEach((key) => {
      if (activeKeys.has(key) && !passwords[key]) {
        passwords[key] = generateEmployeePassword();
      }
    });

    localStorage.setItem(EMPLOYEE_PASSWORDS_KEY, JSON.stringify(passwords));
    return passwords;
  }

  function getEmployeePassword(name) {
    const passwords = ensureEmployeePasswords();
    return passwords[normalizePasswordKey(name)] || "";
  }

  function createEmployeePassword(name) {
    const passwords = ensureEmployeePasswords();
    const key = normalizePasswordKey(name);
    if (!passwords[key]) {
      passwords[key] = generateEmployeePassword();
      localStorage.setItem(EMPLOYEE_PASSWORDS_KEY, JSON.stringify(passwords));
    }
    return passwords[key];
  }

  function removeEmployeePassword(name) {
    const passwords = safeParse(EMPLOYEE_PASSWORDS_KEY, {});
    const key = normalizePasswordKey(name);
    if (passwords && Object.prototype.hasOwnProperty.call(passwords, key)) {
      delete passwords[key];
      localStorage.setItem(EMPLOYEE_PASSWORDS_KEY, JSON.stringify(passwords));
    }
  }

  function updateEmployeePassword(name, currentPassword, nextPassword) {
    const cleanCurrent = String(currentPassword || "").trim();
    const cleanNext = String(nextPassword || "").trim();
    const existing = getEmployeePassword(name);

    if (cleanCurrent !== existing) {
      return { ok: false, message: "Mevcut sifre hatali." };
    }

    if (!/^[A-Za-z0-9]{8}$/.test(cleanNext)) {
      return { ok: false, message: "Yeni sifre 8 karakterli harf/rakam olmalidir." };
    }

    const passwords = ensureEmployeePasswords();
    passwords[normalizePasswordKey(name)] = cleanNext;
    localStorage.setItem(EMPLOYEE_PASSWORDS_KEY, JSON.stringify(passwords));
    return { ok: true, password: cleanNext };
  }

  function findEmployeeName(username) {
    const normalizedInput = normalizeText(username);
    return getEmployeeNames().find((name) => normalizeText(name) === normalizedInput) || null;
  }

  function getSession() {
    const parsed = safeParse(AUTH_KEY, null);
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.role || !parsed.name) return null;
    if (parsed.role === "manager" && parsed.name !== MANAGER_NAME) {
      const migrated = { ...parsed, name: MANAGER_NAME };
      localStorage.setItem(AUTH_KEY, JSON.stringify(migrated));
      return migrated;
    }
    return parsed;
  }

  function setSession(session) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem(AUTH_KEY);
  }

  function getHomeForRole(role) {
    return role === "manager" ? "./talep-olustur.html" : "./index.html";
  }

  function authenticate(username, password) {
    const cleanPassword = String(password || "").trim();
    const managerMatch = normalizeText(username) === normalizeText(MANAGER_NAME);

    if (managerMatch && cleanPassword === MANAGER_PASSWORD) {
      return {
        role: "manager",
        name: MANAGER_NAME,
        loginAt: new Date().toISOString()
      };
    }

    const employeeName = findEmployeeName(username);
    if (employeeName && cleanPassword === getEmployeePassword(employeeName)) {
      return {
        role: "employee",
        name: employeeName,
        loginAt: new Date().toISOString()
      };
    }

    return null;
  }

  function requireSession(options) {
    const settings = options || {};
    const allowedRoles = Array.isArray(settings.allowedRoles) && settings.allowedRoles.length
      ? settings.allowedRoles
      : ["employee", "manager"];

    const session = getSession();
    if (!session) {
      window.location.href = "./giris.html";
      return null;
    }

    if (!allowedRoles.includes(session.role)) {
      window.location.href = getHomeForRole(session.role);
      return null;
    }

    return session;
  }

  function renderTopNav(options) {
    const settings = options || {};
    const container = document.getElementById(settings.containerId || "roleNav");
    if (!container) return;

    const session = settings.session || getSession();
    if (!session) return;

    const items = session.role === "manager"
      ? [
          { key: "talep", href: "./talep-olustur.html", label: "Talep Olustur" },
          { key: "manager", href: "./yonetici-paneli.html", label: "Yonetici Takip" }
        ]
      : [
          { key: "inbox", href: "./index.html", label: "Onay Kutum" },
          { key: "talep", href: "./talep-olustur.html", label: "Talep Olustur" }
        ];

    const passwordButton = session.role === "employee"
      ? '<button id="changePasswordBtn" class="nav-link nav-btn" type="button">Sifre Degistir</button>'
      : "";

    container.innerHTML = `
      ${items.map((item) => `
        <a class="nav-link ${settings.active === item.key ? "active" : ""}" href="${item.href}">${item.label}</a>
      `).join("")}
      <span class="nav-spacer"></span>
      <span class="nav-user">${session.name}</span>
      ${passwordButton}
      <button id="logoutBtn" class="nav-link nav-btn" type="button">Cikis</button>
    `;

    attachPasswordModal(session);

    const changePasswordBtn = document.getElementById("changePasswordBtn");
    if (changePasswordBtn) {
      changePasswordBtn.addEventListener("click", function () {
        openPasswordModal(session);
      });
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        clearSession();
        window.location.href = "./giris.html";
      });
    }
  }

  function ensurePasswordModal() {
    if (!document.getElementById("passwordModalStyle")) {
      const style = document.createElement("style");
      style.id = "passwordModalStyle";
      style.textContent = `
        .password-modal {
          position: fixed;
          inset: 0;
          display: none;
          align-items: center;
          justify-content: center;
          background: rgba(18, 29, 68, 0.28);
          z-index: 60;
          padding: 14px;
        }

        .password-modal.show {
          display: flex;
        }

        .password-card {
          width: min(420px, 100%);
          border: 1px solid #dbe3ff;
          border-radius: 12px;
          background: #fff;
          box-shadow: 0 10px 30px rgba(39, 99, 255, 0.16);
          overflow: hidden;
        }

        .password-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          border-bottom: 1px solid #dbe3ff;
          background: #f8fbff;
        }

        .password-head h3 {
          margin: 0;
          font-size: 0.96rem;
        }

        .password-close {
          border: 1px solid #dbe3ff;
          border-radius: 8px;
          background: #fff;
          color: #4a577e;
          padding: 6px 9px;
          font: inherit;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }

        .password-body {
          padding: 12px;
          display: grid;
          gap: 9px;
        }

        .password-field {
          display: grid;
          gap: 5px;
        }

        .password-field label {
          color: #5f6e8f;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .password-field input {
          width: 100%;
          border: 1px solid #dbe3ff;
          border-radius: 9px;
          padding: 9px 10px;
          font: inherit;
        }

        .password-error {
          min-height: 18px;
          margin: 0;
          color: #9d2030;
          font-size: 0.8rem;
        }

        .password-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        .password-save {
          border: 1px solid #9be4be;
          border-radius: 9px;
          background: #e8fff2;
          color: #056d44;
          padding: 8px 11px;
          font: inherit;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }
      `;
      document.head.appendChild(style);
    }

    if (!document.getElementById("passwordModal")) {
      const modal = document.createElement("div");
      modal.id = "passwordModal";
      modal.className = "password-modal";
      modal.setAttribute("aria-hidden", "true");
      modal.innerHTML = `
        <div class="password-card" role="dialog" aria-modal="true" aria-label="Sifre Degistir">
          <div class="password-head">
            <h3>Sifre Degistir</h3>
            <button id="passwordModalClose" class="password-close" type="button">Kapat</button>
          </div>
          <form id="passwordForm" class="password-body">
            <div class="password-field">
              <label for="currentPassword">Mevcut Sifre</label>
              <input id="currentPassword" type="password" autocomplete="current-password" required>
            </div>
            <div class="password-field">
              <label for="nextPassword">Yeni Sifre</label>
              <input id="nextPassword" type="password" autocomplete="new-password" maxlength="8" required>
            </div>
            <div class="password-field">
              <label for="confirmPassword">Yeni Sifre Tekrar</label>
              <input id="confirmPassword" type="password" autocomplete="new-password" maxlength="8" required>
            </div>
            <p id="passwordError" class="password-error"></p>
            <div class="password-actions">
              <button class="password-save" type="submit">Guncelle</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);
    }
  }

  function openPasswordModal(session) {
    ensurePasswordModal();
    const modal = document.getElementById("passwordModal");
    const error = document.getElementById("passwordError");
    const form = document.getElementById("passwordForm");

    form.reset();
    error.textContent = "";
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.getElementById("currentPassword").focus();
    modal.dataset.employeeName = session.name;
  }

  function closePasswordModal() {
    const modal = document.getElementById("passwordModal");
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  function attachPasswordModal(session) {
    if (session.role !== "employee") return;
    ensurePasswordModal();

    const modal = document.getElementById("passwordModal");
    const closeBtn = document.getElementById("passwordModalClose");
    const form = document.getElementById("passwordForm");
    if (modal.dataset.bound === "true") return;

    closeBtn.addEventListener("click", closePasswordModal);
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closePasswordModal();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("show")) {
        closePasswordModal();
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const current = document.getElementById("currentPassword").value;
      const next = document.getElementById("nextPassword").value;
      const confirm = document.getElementById("confirmPassword").value;
      const error = document.getElementById("passwordError");

      if (next !== confirm) {
        error.textContent = "Yeni sifreler eslesmiyor.";
        return;
      }

      const result = updateEmployeePassword(modal.dataset.employeeName, current, next);
      if (!result.ok) {
        error.textContent = result.message;
        return;
      }

      closePasswordModal();
      alert("Sifreniz guncellendi.");
    });

    modal.dataset.bound = "true";
  }

  window.AppAuth = {
    AUTH_KEY,
    EMPLOYEE_PASSWORDS_KEY,
    authenticate,
    getSession,
    setSession,
    clearSession,
    requireSession,
    renderTopNav,
    getHomeForRole,
    getEmployeeNames,
    getEmployeePassword,
    createEmployeePassword,
    removeEmployeePassword,
    updateEmployeePassword,
    ensureEmployeePasswords
  };
})();
