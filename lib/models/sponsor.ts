import mongoose, { Schema, type Document } from "mongoose"

export interface ISponsor extends Document {
  name: string
  logoUrl: string
}

const SponsorSchema = new Schema<ISponsor>({
  name: { type: String, required: true },
  logoUrl: { type: String, required: true },
})

export const Sponsor = mongoose.models.Sponsor || mongoose.model<ISponsor>("Sponsor", SponsorSchema)
