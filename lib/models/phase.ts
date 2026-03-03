import mongoose, { Schema, type Document } from "mongoose"

export interface IPhase extends Document {
  name: string
  description: string
  contentLink: string
  status: "upcoming" | "active" | "completed"
  order: number
}

const PhaseSchema = new Schema<IPhase>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  contentLink: { type: String, default: "" },
  status: { type: String, enum: ["upcoming", "active", "completed"], default: "upcoming" },
  order: { type: Number, default: 0 },
})

export const Phase = mongoose.models.Phase || mongoose.model<IPhase>("Phase", PhaseSchema)
