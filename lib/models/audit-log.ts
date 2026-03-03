import mongoose, { Schema, type Document } from "mongoose"

export interface IAuditLog extends Document {
  action: string
  performedBy: string
  details: string
  createdAt: Date
}

const AuditLogSchema = new Schema<IAuditLog>({
  action: { type: String, required: true },
  performedBy: { type: String, required: true },
  details: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
})

export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema)
