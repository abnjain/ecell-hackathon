import mongoose, { Schema, type Document } from "mongoose"

export interface IMember {
  name: string
  email: string
  gender: "male" | "female" | "other"
}

export interface ITeam extends Document {
  teamName: string
  leaderName: string
  leaderEmail: string
  leaderPhone: string
  collegeName: string
  courseYear: string
  facultyMentor: {
    type: "SCSIT" | "own"
    ownDetails?: { name: string; number: string }
  }
  members: IMember[]
  utr: string
  status: "pending" | "verified" | "invalidated"
  paymentAmount: number
  registrationDate: Date
  password: string
}

const MemberSchema = new Schema<IMember>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
})

const TeamSchema = new Schema<ITeam>({
  teamName: { type: String, required: true, unique: true },
  leaderName: { type: String, required: true },
  leaderEmail: { type: String, required: true, unique: true },
  leaderPhone: { type: String, required: true },
  collegeName: { type: String, required: true },
  courseYear: { type: String, required: true },
  facultyMentor: {
    type: { type: String, enum: ["SCSIT", "own"], required: true },
    ownDetails: {
      name: { type: String },
      number: { type: String },
    },
  },
  members: { type: [MemberSchema], required: true },
  utr: { type: String, required: true },
  status: { type: String, enum: ["pending", "verified", "invalidated"], default: "pending" },
  paymentAmount: { type: Number, required: true },
  registrationDate: { type: Date, default: Date.now },
  password: { type: String, required: true },
})

export const Team = mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema)
