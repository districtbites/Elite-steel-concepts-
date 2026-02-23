import React from "react";
import { getContacts } from "@/lib/db";
import ContactList from "@/components/admin/ContactList";

export default async function AdminContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-4xl font-black uppercase text-secondary tracking-tighter">Communication Lab</h1>
         <p className="text-gray-400 font-medium">Manage and refine general project inquiries.</p>
      </div>

      <ContactList initialContacts={contacts} />
    </div>
  );
}
