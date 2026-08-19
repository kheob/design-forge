/**
 * A realistic page assembled from the component library.
 *
 * A gallery of components in isolation does not tell you whether a theme works. Spacing
 * rhythm, heading hierarchy and colour balance only become visible on a real page, so the
 * studio can preview this live, and the exporter ships it as example.html to give an LLM a
 * full worked page to pattern-match against.
 *
 * Written using only documented classes, with no hardcoded colours, radii or sizes — it
 * doubles as the proof that the design system is self-sufficient.
 */

export const DEMO_PAGE_HTML = String.raw`
<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item has-text-weight-bold" href="#">Northwind</a>
  </div>
  <div class="navbar-menu is-active">
    <div class="navbar-start">
      <a class="navbar-item" href="#">Dashboard</a>
      <a class="navbar-item is-active" href="#">Orders</a>
      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">Reports</a>
        <div class="navbar-dropdown">
          <a class="navbar-item" href="#">Revenue</a>
          <a class="navbar-item" href="#">Retention</a>
          <hr class="navbar-divider">
          <a class="navbar-item" href="#">Export data</a>
        </div>
      </div>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <span class="badge-wrapper mr-4">
          <button class="button is-ghost">Inbox</button>
          <span class="badge">4</span>
        </span>
        <span class="avatar">AL</span>
      </div>
    </div>
  </div>
</nav>

<section class="section">
  <div class="container">

    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Orders</a></li>
        <li class="is-active"><a href="#" aria-current="page">This quarter</a></li>
      </ul>
    </nav>

    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <div>
            <h1 class="title is-3">Orders</h1>
            <p class="subtitle is-6 has-text-weak">128 orders this quarter</p>
          </div>
        </div>
      </div>
      <div class="level-right">
        <p class="level-item"><button class="button">Export</button></p>
        <p class="level-item"><button class="button is-primary">New order</button></p>
      </div>
    </nav>

    <div class="grid mb-5">
      <div class="cell">
        <div class="stat">
          <span class="stat-label">Revenue</span>
          <span class="stat-value">$48.2k</span>
          <span class="stat-trend is-up">+12.4% vs last quarter</span>
        </div>
      </div>
      <div class="cell">
        <div class="stat">
          <span class="stat-label">Orders</span>
          <span class="stat-value">128</span>
          <span class="stat-trend is-up">+8 vs last quarter</span>
        </div>
      </div>
      <div class="cell">
        <div class="stat">
          <span class="stat-label">Refund rate</span>
          <span class="stat-value">2.4%</span>
          <span class="stat-trend is-down">-0.6% vs last quarter</span>
        </div>
      </div>
      <div class="cell">
        <div class="stat">
          <span class="stat-label">Fulfilment</span>
          <span class="stat-value">
            <span class="progress-ring" style="--bulma-progress-ring-value:72" role="img" aria-label="72 percent">
              <span class="progress-ring-label">72%</span>
            </span>
          </span>
        </div>
      </div>
    </div>

    <article class="message is-warning">
      <div class="message-body">Three orders are awaiting payment confirmation for more than 48 hours.</div>
    </article>

    <div class="columns">
      <div class="column is-8-desktop is-12-mobile">

        <div class="box">
          <div class="tabs">
            <ul>
              <li class="is-active"><a>All</a></li>
              <li><a>Unpaid</a></li>
              <li><a>Shipped</a></li>
            </ul>
          </div>

          <div class="field has-addons mb-4">
            <div class="control is-expanded has-icons-left">
              <input class="input" type="text" placeholder="Search orders">
              <span class="icon is-small is-left">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              </span>
            </div>
            <div class="control">
              <div class="select"><select><option>Any status</option><option>Paid</option><option>Overdue</option></select></div>
            </div>
            <div class="control"><button class="button is-primary">Search</button></div>
          </div>

          <table class="table is-fullwidth is-hoverable is-striped">
            <thead>
              <tr><th>Invoice</th><th>Customer</th><th>Status</th><th>Amount</th></tr>
            </thead>
            <tbody>
              <tr><td>INV-1042</td><td>Northwind Ltd</td><td><span class="tag is-success is-light">Paid</span></td><td>$1,240.00</td></tr>
              <tr><td>INV-1041</td><td>Acme Corp</td><td><span class="tag is-warning is-light">Pending</span></td><td>$860.00</td></tr>
              <tr><td>INV-1040</td><td>Globex</td><td><span class="tag is-danger is-light">Overdue</span></td><td>$2,115.50</td></tr>
              <tr><td>INV-1039</td><td>Initech</td><td><span class="tag is-success is-light">Paid</span></td><td>$430.00</td></tr>
            </tbody>
          </table>

          <nav class="pagination is-centered is-small" role="navigation" aria-label="pagination">
            <a class="pagination-previous">Previous</a>
            <a class="pagination-next">Next</a>
            <ul class="pagination-list">
              <li><a class="pagination-link is-current" aria-current="page">1</a></li>
              <li><a class="pagination-link">2</a></li>
              <li><span class="pagination-ellipsis">&hellip;</span></li>
              <li><a class="pagination-link">9</a></li>
            </ul>
          </nav>
        </div>

      </div>

      <div class="column is-4-desktop is-12-mobile">

        <div class="card mb-5">
          <header class="card-header"><p class="card-header-title">Order INV-1042</p></header>
          <div class="card-content">
            <ol class="stepper is-vertical">
              <li class="stepper-item is-complete"><span class="stepper-marker">1</span><span class="stepper-label">Placed</span></li>
              <li class="stepper-item is-complete"><span class="stepper-marker">2</span><span class="stepper-label">Paid</span></li>
              <li class="stepper-item is-active"><span class="stepper-marker">3</span><span class="stepper-label">In transit</span></li>
              <li class="stepper-item"><span class="stepper-marker">4</span><span class="stepper-label">Delivered</span></li>
            </ol>
          </div>
          <footer class="card-footer">
            <a href="#" class="card-footer-item">Invoice</a>
            <a href="#" class="card-footer-item">Refund</a>
          </footer>
        </div>

        <div class="box mb-5">
          <p class="title is-6">Notifications</p>
          <label class="toggle mb-3">
            <input type="checkbox" checked><span class="toggle-track"></span>
            <span>Email me about new orders</span>
          </label>
          <br>
          <label class="toggle">
            <input type="checkbox"><span class="toggle-track"></span>
            <span>Weekly summary</span>
          </label>
        </div>

        <div class="accordion mb-5">
          <details class="accordion-item" open>
            <summary>How are refunds processed?</summary>
            <div class="accordion-body">Refunds return to the original payment method within five business days.</div>
          </details>
          <details class="accordion-item">
            <summary>Can I change a shipping address?</summary>
            <div class="accordion-body">Only while the order is still marked as Paid.</div>
          </details>
        </div>

        <div class="box">
          <p class="title is-6">Recent activity</p>
          <ol class="timeline">
            <li class="timeline-item">
              <span class="timeline-marker"></span>
              <div class="timeline-title">Order shipped</div>
              <div class="timeline-meta">Today at 14:02</div>
            </li>
            <li class="timeline-item">
              <span class="timeline-marker is-outlined"></span>
              <div class="timeline-title">Payment received</div>
              <div class="timeline-meta">Yesterday at 09:31</div>
            </li>
          </ol>
        </div>

      </div>
    </div>

    <div class="empty-state">
      <span class="empty-state-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </span>
      <p class="empty-state-title">No archived orders yet</p>
      <p class="empty-state-description">Orders you archive will appear here so the main list stays focused on active work.</p>
      <button class="button is-primary">Browse all orders</button>
    </div>

  </div>
</section>

<footer class="footer">
  <div class="content has-text-centered">
    <p><strong>Northwind</strong> — built from a Design Forge design system.</p>
  </div>
</footer>
`;
