This `CONTRIBUTING.md` file is designed specifically for your Board of Directors. It simplifies the technical process of updating the **Operational Log (News)** while ensuring that everyone adheres to the "Victor Standard" of quality and transparency.

---

# Contributing to the VGI News Engine

**"Your voice helps build the sanctuary. Thank you for documenting our impact."**

Welcome to the VGI Digital Command Center. This guide is designed to help board members and authorized advisors submit mission updates, press releases, and operational logs to the `news.html` page.

---

## 🛠 The GitHub Web Workflow (For Non-Developers)

You do not need special software to update the site. You can make updates directly through the web browser:

1. **Navigate:** Go to the `news.html` file in the main repository.
2. **Edit:** Click the **Pencil Icon** (Edit this file) at the top right of the code block.
3. **Find the Grid:** Scroll down until you see the `` or `<div class="news-grid">` section.
4. **Insert Template:** Copy and paste the "News Article Template" (provided below) as the **first item** inside that grid.
5. **Commit Changes:**
* Scroll to the bottom.
* Enter a short description (e.g., "Added March 2026 Shelter Outreach update").
* Select **"Commit directly to the main branch."**
* Click **Commit changes**.


6. **Verify:** Azure will automatically rebuild the site in about 60 seconds. Visit [victorglobal.org/news.html](https://www.google.com/search?q=https://www.victorglobal.org/news.html) to see your update live.

---

## 📄 News Article Template

<article class="news-card" data-aos="fade-up">
    <div class="news-image-fallback" style="background: var(--secondary); height: 10px;"></div>
    <div class="news-content" style="padding: 25px;">
        <span class="news-date" style="font-size: 0.8rem; color: var(--secondary); font-weight: 700;">
            MONTH DATE, 2026
        </span>
        <h4 style="margin: 10px 0; color: var(--primary);">
            TITLE OF THE MISSION UPDATE
        </h4>
        <p style="font-size: 0.9rem; color: #555;">
            Enter 2-3 sentences here detailing the specific impact, shelter visit, or infrastructure milestone.
        </p>
        <a href="/initiatives.html" class="read-more" style="font-size: 0.85rem; font-weight: 700;">
            See Impact Details →
        </a>
    </div>
</article>
---

## ⚖ The Victor Standard (Operational Rules)

To maintain institutional integrity and site security, please follow these three rules:

1. **Absolute Paths Only:** When linking to other pages or images, always start the link with a forward slash (e.g., `/our-story.html`, not `our-story.html`).
2. **Infrastructure First:** For 2026 updates, ensure the language reflects **capability building** and **resource allocation** rather than active scholarship distribution.
3. **Image Protocol:** If you are adding an image, ensure it is uploaded to the `/assets/images/` folder first and that the filename contains no spaces (e.g., `shelter-visit.jpg`).

---

## 🆘 Need Support?

If you encounter a "Merge Conflict" or the site fails to build, do not attempt to force the update. Reach out to Mission Control at **info@victorglobal.org** for a technical handshake.

**Eyes Forward.**

---

**Does this protocol feel easy enough for your board members to follow, or would you like me to create an even simpler "Email to News" workflow suggestion?**