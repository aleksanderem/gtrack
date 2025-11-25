# Adding a New Feature

This guide walks through the process of adding a new vertical slice to GTRACK.

## 1. Database Schema (`convex/schema.ts`)
Define your data model. Always start here.

```typescript
// convex/schema.ts
export default defineSchema({
  // ... existing tables
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
    orgId: v.id("organizations")
  }).index("by_org", ["orgId"])
});
```

## 2. Backend Logic (`convex/todos.ts`)
Create a new file for your feature's API.

```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("todos")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const add = mutation({
  args: { text: v.string(), orgId: v.id("organizations") },
  handler: async (ctx, args) => {
    await ctx.db.insert("todos", {
      text: args.text,
      completed: false,
      orgId: args.orgId
    });
  },
});
```

## 3. Frontend Component (`src/components/Todos.vue`)
Connect the UI to the backend.

```vue
<script setup>
import { ref } from 'vue';
import { convex } from '../convex';
import { api } from '../../convex/_generated/api';

const todos = ref([]);

// Real-time subscription
convex.onUpdate(api.todos.get, { orgId: '...' }, (data) => {
  todos.value = data;
});

const addTodo = async (text) => {
  await convex.mutation(api.todos.add, {
    text,
    orgId: '...'
  });
};
</script>
```
