// models/Portfolio.js

import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
    },

    skills: {
      type: String,
      default: "",
    },

    projects: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    template_name: {
      type: String,
      default: "developer",
    },

    slug: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Portfolio = mongoose.model(
  "Portfolio",
  portfolioSchema
);

export default Portfolio;