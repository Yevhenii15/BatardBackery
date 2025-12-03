<template>
  <div class="admin-wrapper">
    <div class="admin-container">
      <!-- Back -->
      <div class="back-btn-wrapper">
        <NuxtLink to="/admin" class="back-btn">←</NuxtLink>
      </div>

      <!-- Header -->
      <h1 class="admin-title">Contact messages</h1>
      <p class="admin-subtitle">
        View, update status and add internal notes to customer inquiries.
      </p>

      <!-- Error -->
      <div v-if="error" class="alert-error">
        {{ error }}
      </div>

      <!-- Card: table -->
      <div class="admin-card">
        <header class="card-header">
          <div>
            <h2 class="card-title">Inbox</h2>
            <p class="card-subtitle">
              {{ total }} message{{ total === 1 ? "" : "s" }} total
            </p>
          </div>

          <div class="card-filters">
            <label>
              Status:
              <select v-model="filterStatus">
                <option value="">All</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </label>

            <button class="refresh-btn" type="button" @click="reload">
              Refresh
            </button>
          </div>
        </header>

        <div v-if="loading" class="loading-text">Loading messages…</div>

        <div v-else-if="!messages.length" class="empty-text">
          No messages found with current filters.
        </div>

        <div v-else class="table-wrapper">
          <table class="messages-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Note</th>
                <!-- NEW -->
                <th>Received</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="m in messages"
                :key="m._id"
                :class="{ 'row-selected': selectedId === m._id }"
              >
                <td>
                  <div class="cell-main">
                    <div class="cell-name">
                      {{ m.firstName }} {{ m.lastName }}
                    </div>
                    <div class="cell-email">{{ m.email }}</div>
                  </div>
                </td>

                <td>{{ m.subject }}</td>

                <td>
                  <span :class="['status-pill', m.status]">
                    {{ statusLabel(m.status) }}
                  </span>
                </td>

                <!-- ⭐ NEW: admin note preview -->
                <td class="note-preview">
                  <span v-if="m.adminNote && m.adminNote.trim().length">
                    {{
                      m.adminNote.length > 50
                        ? m.adminNote.slice(0, 50) + "…"
                        : m.adminNote
                    }}
                  </span>
                  <span v-else class="note-empty">—</span>
                </td>

                <td>{{ formatDate(m.createdAt) }}</td>

                <td class="text-right">
                  <button
                    class="small-btn"
                    type="button"
                    @click="selectMessage(m)"
                  >
                    View / Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Card: details -->
      <div class="admin-card" v-if="selected">
        <h2 class="card-title">Message details</h2>
        <p class="card-subtitle">
          Manage status and internal note for this inquiry.
        </p>

        <div class="details-grid">
          <!-- Left: message info -->
          <div class="details-left">
            <div class="detail-block">
              <h3>Customer</h3>
              <p>
                <strong>Name:</strong>
                {{ selected.firstName }} {{ selected.lastName }}
              </p>
              <p><strong>Email:</strong> {{ selected.email }}</p>
              <p v-if="selected.phone">
                <strong>Phone:</strong> {{ selected.phone }}
              </p>
              <p>
                <strong>Received:</strong> {{ formatDate(selected.createdAt) }}
              </p>
            </div>

            <div class="detail-block">
              <h3>Subject</h3>
              <p>{{ selected.subject }}</p>
            </div>

            <div class="detail-block">
              <h3>Message</h3>
              <p class="message-body">
                {{ selected.message }}
              </p>
            </div>
          </div>

          <!-- Right: status + note -->
          <div class="details-right">
            <div class="detail-block">
              <h3>Status</h3>
              <select v-model="editStatus">
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div class="detail-block">
              <h3>Internal note</h3>
              <textarea
                v-model="editNote"
                rows="6"
                placeholder="Add internal note (not visible to customer)"
              ></textarea>
            </div>

            <div class="details-actions">
              <button
                type="button"
                class="btn-secondary"
                @click="clearSelection"
              >
                Close
              </button>
              <button
                type="button"
                class="btn-primary"
                :disabled="loading"
                @click="saveChanges"
              >
                {{ loading ? "Saving…" : "Save changes" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- If nothing selected -->
      <div class="admin-card" v-else>
        <h2 class="card-title">Message details</h2>
        <p class="card-subtitle">
          Select a message from the table above to see its details.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {
  useContactMessages,
  type ContactMessage,
  type ContactStatus,
} from "~/composables/useContactMessages";

const { messages, total, loading, error, getMessages, updateMessage } =
  useContactMessages();

// filters
const filterStatus = ref<string>("");

// selection
const selectedId = ref<string | null>(null);
const selected = ref<ContactMessage | null>(null);

// edit fields
const editStatus = ref<ContactStatus>("open");
const editNote = ref("");

// load messages
const reload = async () => {
  const statusParam = filterStatus.value || undefined;

  await getMessages(1, 50, statusParam as ContactStatus | undefined);
};

onMounted(async () => {
  await reload();
});

// when selection changes, sync edit fields
watch(
  () => selected.value,
  (val) => {
    if (!val) return;
    editStatus.value = val.status;
    editNote.value = val.adminNote ?? "";
  }
);

// helpers
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("da-DK", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusLabel = (status: ContactStatus) => {
  if (status === "open") return "Open";
  return "Closed";
};

const selectMessage = (m: ContactMessage) => {
  selectedId.value = m._id;
  selected.value = m;
};

const clearSelection = () => {
  selectedId.value = null;
  selected.value = null;
};

const saveChanges = async () => {
  if (!selected.value) return;

  // If status is "closed", your backend should set closedAt and TTL will handle deletion
  const ok = await updateMessage(selected.value._id, {
    status: editStatus.value,
    adminNote: editNote.value.trim() || "",
  });

  if (ok) {
    await reload();

    const updated = messages.value.find((m) => m._id === selected.value?._id);
    if (updated) {
      selected.value = updated;
      selectedId.value = updated._id;
      editStatus.value = updated.status;
      editNote.value = updated.adminNote ?? "";
    } else {
      // message might have disappeared (e.g. if your API filters closed ones)
      clearSelection();
    }

    alert("Message updated successfully.");
  } else {
    alert("Failed to update message.");
  }
};
</script>

<style scoped>
.back-btn-wrapper {
  text-align: left;
  margin-bottom: 20px;
}

.back-btn {
  display: inline-block;
  background: #3b4b3d;
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-decoration: none;
  transition: 0.2s ease;
  font-weight: bold;
}

.back-btn:hover {
  background: #283529;
}

.admin-wrapper {
  background: #211a1a;
  min-height: 100vh;
  padding: 40px 0;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.admin-container {
  width: 90%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px;
  border-radius: 16px;
  background: #5d7261;
  box-shadow: 0px 0px 35px rgba(0, 0, 0, 0.45);
  text-align: center;
}

.admin-title {
  font-size: 32px;
  font-family: Georgia, serif;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10px;
}

.admin-subtitle {
  color: #e7e7e7;
  margin-bottom: 30px;
  font-size: 15px;
}

.admin-card {
  background: #f4f4f4;
  padding: 25px;
  border-radius: 14px;
  margin-bottom: 30px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.25);
  text-align: left;
}

.alert-error {
  background: #c67b7b;
  color: #fff;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
}

/* Card header */
.card-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.card-title {
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: bold;
}

.card-subtitle {
  font-size: 13px;
  color: #555;
}

/* Filters */
.card-filters {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 13px;
}

.card-filters select {
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
  font-size: 13px;
}

.refresh-btn {
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  background: #3b4b3d;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
}

.refresh-btn:hover {
  background: #283529;
}

/* Table */
.loading-text,
.empty-text {
  font-size: 14px;
  color: #444;
  margin-top: 10px;
}

.table-wrapper {
  margin-top: 10px;
  overflow-x: auto;
}

.messages-table {
  width: 100%;
  border-collapse: collapse;
}

.messages-table thead th {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  padding: 8px 6px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

.messages-table tbody td {
  padding: 10px 6px;
  font-size: 14px;
  border-bottom: 1px solid #e5e7eb;
}

.row-selected {
  background: #e5f0e8;
}

/* Cells */
.cell-main {
  display: flex;
  flex-direction: column;
}

.cell-name {
  font-weight: 600;
  color: #111827;
}

.cell-email {
  font-size: 12px;
  color: #6b7280;
}

/* Pills */
.status-pill {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}

.status-pill.open {
  background: #fee2e2;
  color: #b91c1c;
}

.status-pill.in_progress {
  background: #fef9c3;
  color: #a16207;
}

.status-pill.closed {
  background: #dcfce7;
  color: #166534;
}

.archived-pill {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
}

.arch-yes {
  background: #e5e7eb;
  color: #374151;
}

.arch-no {
  background: #e0f2fe;
  color: #0369a1;
}

.small-btn {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #6b7280;
  background: #ffffff;
  font-size: 12px;
  cursor: pointer;
}

.small-btn:hover {
  background: #f3f4f6;
}

.text-right {
  text-align: right;
}

/* Details layout */
.details-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 1.5rem;
  margin-top: 1rem;
}

@media (max-width: 900px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
}

.details-left,
.details-right {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-block h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.detail-block p {
  font-size: 14px;
  margin-bottom: 0.2rem;
}

.message-body {
  white-space: pre-wrap;
}

/* inputs / textarea */
.details-right select,
.details-right textarea {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 8px 10px;
  font-size: 14px;
  font-family: inherit;
}

.checkbox-line {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.details-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.btn-primary,
.btn-secondary {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  cursor: pointer;
}

.btn-secondary {
  background: #e5e7eb;
  color: #111827;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.btn-primary {
  background: #334334;
  color: #ffffff;
}

.btn-primary:hover {
  background: #1d281d;
}
.note-preview {
  font-size: 13px;
  color: #374151;
  max-width: 180px;
}

.note-empty {
  color: #9ca3af;
  font-style: italic;
}
.text-right {
  text-align: start;
}
</style>
