<script setup lang="ts">
import type { Category } from "~/composables/useCategory";

const props = defineProps<{
  categories: Category[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", category: Category): void;
  (e: "delete", id: string): void;
}>();
</script>

<template>
  <div class="table-container">
    <div class="table-header">
      <h2>Categories</h2>
      <span v-if="loading" class="loading">Loading…</span>
    </div>

    <div v-if="!categories.length && !loading" class="empty-state">
      No categories found.
    </div>

    <table v-else>
      <thead>
        <tr>
          <th>Name</th>
          <th>Weekdays</th>
          <th>Weekends</th>
          <th>Slot</th>
          <th>Lead</th>
          <th class="actions-col">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="cat in categories" :key="cat._id">
          <td>{{ cat.categoryName }}</td>
          <td>{{ cat.weekdayTime.from }}–{{ cat.weekdayTime.to }}</td>
          <td>{{ cat.weekendsTime.from }}–{{ cat.weekendsTime.to }}</td>
          <td>{{ cat.slotSizeMinutes }} min</td>
          <td>{{ cat.leadTimeMinutes }} min</td>

          <td class="text-right actions">
            <button class="btn-edit" @click="emit('edit', cat)">Edit</button>
            <button class="btn-delete" @click="emit('delete', cat._id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  color: #333;
  background: #ffffff;
  padding: 1.6rem 2rem;
  border-radius: 16px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

/* Header */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h2 {
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: bold;
  color: #2c2c2c;
}

.loading {
  font-size: 14px;
  color: #666;
}

.empty-state {
  font-size: 14px;
  color: #777;
  padding: 15px 0;
}

/* Table base */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}

/* Header row */
thead th {
  text-align: left;
  padding: 10px 8px;
  font-size: 13px;
  color: #555;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}

/* Rows */
tbody tr {
  background: #f7f7f7;
  border-radius: 8px;
  overflow: hidden;
  transition: 0.2s ease;
}

tbody tr:hover {
  background: #eeeeee;
}

td {
  padding: 12px 10px;
  font-size: 14px;
  color: #333;
}

/* Actions column */
.actions-col {
  text-align: right;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* Buttons */
button {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s ease;
  border: none;
}

/* Edit button */
.btn-edit {
  background: #5d7261; /* green theme */
  color: #fff;
}

.btn-edit:hover {
  background: #46574a;
}

/* Delete button */
.btn-delete {
  background: #c94f4f;
  color: #fff;
}

.btn-delete:hover {
  background: #a93f3f;
}
</style>







<script setup lang="ts">
import type { Category } from "~/composables/useCategory";

const props = defineProps<{
  categories: Category[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", category: Category): void;
  (e: "delete", id: string): void;
}>();
</script>

<template>
  <div class="table-container">
    <div class="table-header">
      <h2>Categories</h2>
      <span v-if="loading" class="loading">Loading…</span>
    </div>

    <div v-if="!categories.length && !loading" class="empty-state">
      No categories found.
    </div>

    <table v-else>
      <thead>
        <tr>
          <th>Name</th>
          <th>Weekdays</th>
          <th>Weekends</th>
          <th>Slot</th>
          <th>Lead</th>
          <th class="actions-col">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="cat in categories" :key="cat._id">
          <td>{{ cat.categoryName }}</td>
          <td>{{ cat.weekdayTime.from }}–{{ cat.weekdayTime.to }}</td>
          <td>{{ cat.weekendsTime.from }}–{{ cat.weekendsTime.to }}</td>
          <td>{{ cat.slotSizeMinutes }} min</td>
          <td>{{ cat.leadTimeMinutes }} min</td>

          <td class="text-right actions">
            <button class="btn-edit" @click="emit('edit', cat)">Edit</button>
            <button class="btn-delete" @click="emit('delete', cat._id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  color: #333;
  background: #ffffff;
  padding: 1.6rem 2rem;
  border-radius: 16px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

/* Header */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h2 {
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: bold;
  color: #2c2c2c;
}

.loading {
  font-size: 14px;
  color: #666;
}

.empty-state {
  font-size: 14px;
  color: #777;
  padding: 15px 0;
}

/* Table base */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}

/* Header row */
thead th {
  text-align: left;
  padding: 10px 8px;
  font-size: 13px;
  color: #555;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}

/* Rows */
tbody tr {
  background: #f7f7f7;
  border-radius: 8px;
  overflow: hidden;
  transition: 0.2s ease;
}

tbody tr:hover {
  background: #eeeeee;
}

td {
  padding: 12px 10px;
  font-size: 14px;
  color: #333;
}

/* Actions column */
.actions-col {
  text-align: right;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* Buttons */
button {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s ease;
  border: none;
}

/* Edit button */
.btn-edit {
  background: #5d7261; /* green theme */
  color: #fff;
}

.btn-edit:hover {
  background: #46574a;
}

/* Delete button */
.btn-delete {
  background: #c94f4f;
  color: #fff;
}

.btn-delete:hover {
  background: #a93f3f;
}
</style>
<script setup lang="ts">
import type { Category } from "~/composables/useCategory";

const props = defineProps<{
  categories: Category[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", category: Category): void;
  (e: "delete", id: string): void;
}>();
</script>

<template>
  <div class="table-container">
    <div class="table-header">
      <h2>Categories</h2>
      <span v-if="loading" class="loading">Loading…</span>
    </div>

    <div v-if="!categories.length && !loading" class="empty-state">
      No categories found.
    </div>

    <table v-else>
      <thead>
        <tr>
          <th>Name</th>
          <th>Weekdays</th>
          <th>Weekends</th>
          <th>Slot</th>
          <th>Lead</th>
          <th class="actions-col">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="cat in categories" :key="cat._id">
          <td>{{ cat.categoryName }}</td>
          <td>{{ cat.weekdayTime.from }}–{{ cat.weekdayTime.to }}</td>
          <td>{{ cat.weekendsTime.from }}–{{ cat.weekendsTime.to }}</td>
          <td>{{ cat.slotSizeMinutes }} min</td>
          <td>{{ cat.leadTimeMinutes }} min</td>

          <td class="text-right actions">
            <button class="btn-edit" @click="emit('edit', cat)">Edit</button>
            <button class="btn-delete" @click="emit('delete', cat._id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  color: #333;
  background: #ffffff;
  padding: 1.6rem 2rem;
  border-radius: 16px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

/* Header */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h2 {
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: bold;
  color: #2c2c2c;
}

.loading {
  font-size: 14px;
  color: #666;
}

.empty-state {
  font-size: 14px;
  color: #777;
  padding: 15px 0;
}

/* Table base */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}

/* Header row */
thead th {
  text-align: left;
  padding: 10px 8px;
  font-size: 13px;
  color: #555;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}

/* Rows */
tbody tr {
  background: #f7f7f7;
  border-radius: 8px;
  overflow: hidden;
  transition: 0.2s ease;
}

tbody tr:hover {
  background: #eeeeee;
}

td {
  padding: 12px 10px;
  font-size: 14px;
  color: #333;
}

/* Actions column */
.actions-col {
  text-align: right;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* Buttons */
button {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s ease;
  border: none;
}

/* Edit button */
.btn-edit {
  background: #5d7261; /* green theme */
  color: #fff;
}

.btn-edit:hover {
  background: #46574a;
}

/* Delete button */
.btn-delete {
  background: #c94f4f;
  color: #fff;
}

.btn-delete:hover {
  background: #a93f3f;
}
</style>
<script setup lang="ts">
import type { Category } from "~/composables/useCategory";

const props = defineProps<{
  categories: Category[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", category: Category): void;
  (e: "delete", id: string): void;
}>();
</script>

<template>
  <div class="table-container">
    <div class="table-header">
      <h2>Categories</h2>
      <span v-if="loading" class="loading">Loading…</span>
    </div>

    <div v-if="!categories.length && !loading" class="empty-state">
      No categories found.
    </div>

    <table v-else>
      <thead>
        <tr>
          <th>Name</th>
          <th>Weekdays</th>
          <th>Weekends</th>
          <th>Slot</th>
          <th>Lead</th>
          <th class="actions-col">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="cat in categories" :key="cat._id">
          <td>{{ cat.categoryName }}</td>
          <td>{{ cat.weekdayTime.from }}–{{ cat.weekdayTime.to }}</td>
          <td>{{ cat.weekendsTime.from }}–{{ cat.weekendsTime.to }}</td>
          <td>{{ cat.slotSizeMinutes }} min</td>
          <td>{{ cat.leadTimeMinutes }} min</td>

          <td class="text-right actions">
            <button class="btn-edit" @click="emit('edit', cat)">Edit</button>
            <button class="btn-delete" @click="emit('delete', cat._id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  color: #333;
  background: #ffffff;
  padding: 1.6rem 2rem;
  border-radius: 16px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

/* Header */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h2 {
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: bold;
  color: #2c2c2c;
}

.loading {
  font-size: 14px;
  color: #666;
}

.empty-state {
  font-size: 14px;
  color: #777;
  padding: 15px 0;
}

/* Table base */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}

/* Header row */
thead th {
  text-align: left;
  padding: 10px 8px;
  font-size: 13px;
  color: #555;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}

/* Rows */
tbody tr {
  background: #f7f7f7;
  border-radius: 8px;
  overflow: hidden;
  transition: 0.2s ease;
}

tbody tr:hover {
  background: #eeeeee;
}

td {
  padding: 12px 10px;
  font-size: 14px;
  color: #333;
}

/* Actions column */
.actions-col {
  text-align: right;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* Buttons */
button {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s ease;
  border: none;
}

/* Edit button */
.btn-edit {
  background: #5d7261; /* green theme */
  color: #fff;
}

.btn-edit:hover {
  background: #46574a;
}

/* Delete button */
.btn-delete {
  background: #c94f4f;
  color: #fff;
}

.btn-delete:hover {
  background: #a93f3f;
}
</style>
<script setup lang="ts">
import type { Category } from "~/composables/useCategory";

const props = defineProps<{
  categories: Category[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", category: Category): void;
  (e: "delete", id: string): void;
}>();
</script>

<template>
  <div class="table-container">
    <div class="table-header">
      <h2>Categories</h2>
      <span v-if="loading" class="loading">Loading…</span>
    </div>

    <div v-if="!categories.length && !loading" class="empty-state">
      No categories found.
    </div>

    <table v-else>
      <thead>
        <tr>
          <th>Name</th>
          <th>Weekdays</th>
          <th>Weekends</th>
          <th>Slot</th>
          <th>Lead</th>
          <th class="actions-col">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="cat in categories" :key="cat._id">
          <td>{{ cat.categoryName }}</td>
          <td>{{ cat.weekdayTime.from }}–{{ cat.weekdayTime.to }}</td>
          <td>{{ cat.weekendsTime.from }}–{{ cat.weekendsTime.to }}</td>
          <td>{{ cat.slotSizeMinutes }} min</td>
          <td>{{ cat.leadTimeMinutes }} min</td>

          <td class="text-right actions">
            <button class="btn-edit" @click="emit('edit', cat)">Edit</button>
            <button class="btn-delete" @click="emit('delete', cat._id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  color: #333;
  background: #ffffff;
  padding: 1.6rem 2rem;
  border-radius: 16px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

/* Header */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h2 {
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: bold;
  color: #2c2c2c;
}

.loading {
  font-size: 14px;
  color: #666;
}

.empty-state {
  font-size: 14px;
  color: #777;
  padding: 15px 0;
}

/* Table base */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}

/* Header row */
thead th {
  text-align: left;
  padding: 10px 8px;
  font-size: 13px;
  color: #555;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}

/* Rows */
tbody tr {
  background: #f7f7f7;
  border-radius: 8px;
  overflow: hidden;
  transition: 0.2s ease;
}

tbody tr:hover {
  background: #eeeeee;
}

td {
  padding: 12px 10px;
  font-size: 14px;
  color: #333;
}

/* Actions column */
.actions-col {
  text-align: right;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* Buttons */
button {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s ease;
  border: none;
}

/* Edit button */
.btn-edit {
  background: #5d7261; /* green theme */
  color: #fff;
}

.btn-edit:hover {
  background: #46574a;
}

/* Delete button */
.btn-delete {
  background: #c94f4f;
  color: #fff;
}

.btn-delete:hover {
  background: #a93f3f;
}
</style>
<script setup lang="ts">
import type { Category } from "~/composables/useCategory";

const props = defineProps<{
  categories: Category[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", category: Category): void;
  (e: "delete", id: string): void;
}>();
</script>

<template>
  <div class="table-container">
    <div class="table-header">
      <h2>Categories</h2>
      <span v-if="loading" class="loading">Loading…</span>
    </div>

    <div v-if="!categories.length && !loading" class="empty-state">
      No categories found.
    </div>

    <table v-else>
      <thead>
        <tr>
          <th>Name</th>
          <th>Weekdays</th>
          <th>Weekends</th>
          <th>Slot</th>
          <th>Lead</th>
          <th class="actions-col">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="cat in categories" :key="cat._id">
          <td>{{ cat.categoryName }}</td>
          <td>{{ cat.weekdayTime.from }}–{{ cat.weekdayTime.to }}</td>
          <td>{{ cat.weekendsTime.from }}–{{ cat.weekendsTime.to }}</td>
          <td>{{ cat.slotSizeMinutes }} min</td>
          <td>{{ cat.leadTimeMinutes }} min</td>

          <td class="text-right actions">
            <button class="btn-edit" @click="emit('edit', cat)">Edit</button>
            <button class="btn-delete" @click="emit('delete', cat._id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  color: #333;
  background: #ffffff;
  padding: 1.6rem 2rem;
  border-radius: 16px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

/* Header */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h2 {
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: bold;
  color: #2c2c2c;
}

.loading {
  font-size: 14px;
  color: #666;
}

.empty-state {
  font-size: 14px;
  color: #777;
  padding: 15px 0;
}

/* Table base */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}

/* Header row */
thead th {
  text-align: left;
  padding: 10px 8px;
  font-size: 13px;
  color: #555;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}

/* Rows */
tbody tr {
  background: #f7f7f7;
  border-radius: 8px;
  overflow: hidden;
  transition: 0.2s ease;
}

tbody tr:hover {
  background: #eeeeee;
}

td {
  padding: 12px 10px;
  font-size: 14px;
  color: #333;
}

/* Actions column */
.actions-col {
  text-align: right;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* Buttons */
button {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s ease;
  border: none;
}

/* Edit button */
.btn-edit {
  background: #5d7261; /* green theme */
  color: #fff;
}

.btn-edit:hover {
  background: #46574a;
}

/* Delete button */
.btn-delete {
  background: #c94f4f;
  color: #fff;
}

.btn-delete:hover {
  background: #a93f3f;
}
</style>
<script setup lang="ts">
import type { Category } from "~/composables/useCategory";

const props = defineProps<{
  categories: Category[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", category: Category): void;
  (e: "delete", id: string): void;
}>();
</script>

<template>
  <div class="table-container">
    <div class="table-header">
      <h2>Categories</h2>
      <span v-if="loading" class="loading">Loading…</span>
    </div>

    <div v-if="!categories.length && !loading" class="empty-state">
      No categories found.
    </div>

    <table v-else>
      <thead>
        <tr>
          <th>Name</th>
          <th>Weekdays</th>
          <th>Weekends</th>
          <th>Slot</th>
          <th>Lead</th>
          <th class="actions-col">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="cat in categories" :key="cat._id">
          <td>{{ cat.categoryName }}</td>
          <td>{{ cat.weekdayTime.from }}–{{ cat.weekdayTime.to }}</td>
          <td>{{ cat.weekendsTime.from }}–{{ cat.weekendsTime.to }}</td>
          <td>{{ cat.slotSizeMinutes }} min</td>
          <td>{{ cat.leadTimeMinutes }} min</td>

          <td class="text-right actions">
            <button class="btn-edit" @click="emit('edit', cat)">Edit</button>
            <button class="btn-delete" @click="emit('delete', cat._id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  color: #333;
  background: #ffffff;
  padding: 1.6rem 2rem;
  border-radius: 16px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

/* Header */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h2 {
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: bold;
  color: #2c2c2c;
}

.loading {
  font-size: 14px;
  color: #666;
}

.empty-state {
  font-size: 14px;
  color: #777;
  padding: 15px 0;
}

/* Table base */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}

/* Header row */
thead th {
  text-align: left;
  padding: 10px 8px;
  font-size: 13px;
  color: #555;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}

/* Rows */
tbody tr {
  background: #f7f7f7;
  border-radius: 8px;
  overflow: hidden;
  transition: 0.2s ease;
}

tbody tr:hover {
  background: #eeeeee;
}

td {
  padding: 12px 10px;
  font-size: 14px;
  color: #333;
}

/* Actions column */
.actions-col {
  text-align: right;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* Buttons */
button {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s ease;
  border: none;
}

/* Edit button */
.btn-edit {
  background: #5d7261; /* green theme */
  color: #fff;
}

.btn-edit:hover {
  background: #46574a;
}

/* Delete button */
.btn-delete {
  background: #c94f4f;
  color: #fff;
}

.btn-delete:hover {
  background: #a93f3f;
}
</style>
<script setup lang="ts">
import type { Category } from "~/composables/useCategory";

const props = defineProps<{
  categories: Category[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", category: Category): void;
  (e: "delete", id: string): void;
}>();
</script>

<template>
  <div class="table-container">
    <div class="table-header">
      <h2>Categories</h2>
      <span v-if="loading" class="loading">Loading…</span>
    </div>

    <div v-if="!categories.length && !loading" class="empty-state">
      No categories found.
    </div>

    <table v-else>
      <thead>
        <tr>
          <th>Name</th>
          <th>Weekdays</th>
          <th>Weekends</th>
          <th>Slot</th>
          <th>Lead</th>
          <th class="actions-col">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="cat in categories" :key="cat._id">
          <td>{{ cat.categoryName }}</td>
          <td>{{ cat.weekdayTime.from }}–{{ cat.weekdayTime.to }}</td>
          <td>{{ cat.weekendsTime.from }}–{{ cat.weekendsTime.to }}</td>
          <td>{{ cat.slotSizeMinutes }} min</td>
          <td>{{ cat.leadTimeMinutes }} min</td>

          <td class="text-right actions">
            <button class="btn-edit" @click="emit('edit', cat)">Edit</button>
            <button class="btn-delete" @click="emit('delete', cat._id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  color: #333;
  background: #ffffff;
  padding: 1.6rem 2rem;
  border-radius: 16px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

/* Header */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h2 {
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: bold;
  color: #2c2c2c;
}

.loading {
  font-size: 14px;
  color: #666;
}

.empty-state {
  font-size: 14px;
  color: #777;
  padding: 15px 0;
}

/* Table base */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}

/* Header row */
thead th {
  text-align: left;
  padding: 10px 8px;
  font-size: 13px;
  color: #555;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}

/* Rows */
tbody tr {
  background: #f7f7f7;
  border-radius: 8px;
  overflow: hidden;
  transition: 0.2s ease;
}

tbody tr:hover {
  background: #eeeeee;
}

td {
  padding: 12px 10px;
  font-size: 14px;
  color: #333;
}

/* Actions column */
.actions-col {
  text-align: right;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* Buttons */
button {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s ease;
  border: none;
}

/* Edit button */
.btn-edit {
  background: #5d7261; /* green theme */
  color: #fff;
}

.btn-edit:hover {
  background: #46574a;
}

/* Delete button */
.btn-delete {
  background: #c94f4f;
  color: #fff;
}

.btn-delete:hover {
  background: #a93f3f;
}
</style>
<script setup lang="ts">
import type { Category } from "~/composables/useCategory";

const props = defineProps<{
  categories: Category[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", category: Category): void;
  (e: "delete", id: string): void;
}>();
</script>

<template>
  <div class="table-container">
    <div class="table-header">
      <h2>Categories</h2>
      <span v-if="loading" class="loading">Loading…</span>
    </div>

    <div v-if="!categories.length && !loading" class="empty-state">
      No categories found.
    </div>

    <table v-else>
      <thead>
        <tr>
          <th>Name</th>
          <th>Weekdays</th>
          <th>Weekends</th>
          <th>Slot</th>
          <th>Lead</th>
          <th class="actions-col">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="cat in categories" :key="cat._id">
          <td>{{ cat.categoryName }}</td>
          <td>{{ cat.weekdayTime.from }}–{{ cat.weekdayTime.to }}</td>
          <td>{{ cat.weekendsTime.from }}–{{ cat.weekendsTime.to }}</td>
          <td>{{ cat.slotSizeMinutes }} min</td>
          <td>{{ cat.leadTimeMinutes }} min</td>

          <td class="text-right actions">
            <button class="btn-edit" @click="emit('edit', cat)">Edit</button>
            <button class="btn-delete" @click="emit('delete', cat._id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  color: #333;
  background: #ffffff;
  padding: 1.6rem 2rem;
  border-radius: 16px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

/* Header */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h2 {
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: bold;
  color: #2c2c2c;
}

.loading {
  font-size: 14px;
  color: #666;
}

.empty-state {
  font-size: 14px;
  color: #777;
  padding: 15px 0;
}

/* Table base */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}

/* Header row */
thead th {
  text-align: left;
  padding: 10px 8px;
  font-size: 13px;
  color: #555;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}

/* Rows */
tbody tr {
  background: #f7f7f7;
  border-radius: 8px;
  overflow: hidden;
  transition: 0.2s ease;
}

tbody tr:hover {
  background: #eeeeee;
}

td {
  padding: 12px 10px;
  font-size: 14px;
  color: #333;
}

/* Actions column */
.actions-col {
  text-align: right;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* Buttons */
button {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s ease;
  border: none;
}

/* Edit button */
.btn-edit {
  background: #5d7261; /* green theme */
  color: #fff;
}

.btn-edit:hover {
  background: #46574a;
}

/* Delete button */
.btn-delete {
  background: #c94f4f;
  color: #fff;
}

.btn-delete:hover {
  background: #a93f3f;
}
</style>
<script setup lang="ts">
import type { Category } from "~/composables/useCategory";

const props = defineProps<{
  categories: Category[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", category: Category): void;
  (e: "delete", id: string): void;
}>();
</script>

<template>
  <div class="table-container">
    <div class="table-header">
      <h2>Categories</h2>
      <span v-if="loading" class="loading">Loading…</span>
    </div>

    <div v-if="!categories.length && !loading" class="empty-state">
      No categories found.
    </div>

    <table v-else>
      <thead>
        <tr>
          <th>Name</th>
          <th>Weekdays</th>
          <th>Weekends</th>
          <th>Slot</th>
          <th>Lead</th>
          <th class="actions-col">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="cat in categories" :key="cat._id">
          <td>{{ cat.categoryName }}</td>
          <td>{{ cat.weekdayTime.from }}–{{ cat.weekdayTime.to }}</td>
          <td>{{ cat.weekendsTime.from }}–{{ cat.weekendsTime.to }}</td>
          <td>{{ cat.slotSizeMinutes }} min</td>
          <td>{{ cat.leadTimeMinutes }} min</td>

          <td class="text-right actions">
            <button class="btn-edit" @click="emit('edit', cat)">Edit</button>
            <button class="btn-delete" @click="emit('delete', cat._id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  color: #333;
  background: #ffffff;
  padding: 1.6rem 2rem;
  border-radius: 16px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

/* Header */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h2 {
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: bold;
  color: #2c2c2c;
}

.loading {
  font-size: 14px;
  color: #666;
}

.empty-state {
  font-size: 14px;
  color: #777;
  padding: 15px 0;
}

/* Table base */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}

/* Header row */
thead th {
  text-align: left;
  padding: 10px 8px;
  font-size: 13px;
  color: #555;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}

/* Rows */
tbody tr {
  background: #f7f7f7;
  border-radius: 8px;
  overflow: hidden;
  transition: 0.2s ease;
}

tbody tr:hover {
  background: #eeeeee;
}

td {
  padding: 12px 10px;
  font-size: 14px;
  color: #333;
}

/* Actions column */
.actions-col {
  text-align: right;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* Buttons */
button {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s ease;
  border: none;
}

/* Edit button */
.btn-edit {
  background: #5d7261; /* green theme */
  color: #fff;
}

.btn-edit:hover {
  background: #46574a;
}

/* Delete button */
.btn-delete {
  background: #c94f4f;
  color: #fff;
}

.btn-delete:hover {
  background: #a93f3f;
}
</style>

