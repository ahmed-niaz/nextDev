"use client";
import { CalendarForm } from "@/components/Calendar";
import { SelectDropDown } from "@/components/DropDown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const CreateEvents = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    overview: "",
    imageFile: null as File | null,
    venue: "",
    location: "",
    date: new Date(),
    time: "",
    mode: "",
    audience: "",
    tags: [] as string[],
    agenda: [] as string[],
    organizer: "",
  });

  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // For tags and agenda input
  const [tagInput, setTagInput] = useState("");
  const [agendaInput, setAgendaInput] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
      });
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData({
      ...formData,
      date: date || new Date(),
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const addAgenda = () => {
    if (agendaInput.trim() && !formData.agenda.includes(agendaInput.trim())) {
      setFormData({
        ...formData,
        agenda: [...formData.agenda, agendaInput.trim()],
      });
      setAgendaInput("");
    }
  };

  const removeAgenda = (index: number) => {
    setFormData({
      ...formData,
      agenda: formData.agenda.filter((_, i) => i !== index),
    });
  };

  const createEventsForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("overview", formData.overview);
      formDataToSend.append("venue", formData.venue);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("date", formData.date.toISOString());
      formDataToSend.append("time", formData.time);
      formDataToSend.append("mode", formData.mode);
      formDataToSend.append("audience", formData.audience);
      formDataToSend.append("organizer", formData.organizer);
      formDataToSend.append("tags", JSON.stringify(formData.tags));
      formDataToSend.append("agenda", JSON.stringify(formData.agenda));

      if (formData.imageFile) {
        formDataToSend.append("image", formData.imageFile);
      }

      const response = await fetch("/api/events", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to create event");
      }
      setFormData({
        title: "",
        description: "",
        overview: "",
        imageFile: null,
        venue: "",
        location: "",
        date: new Date(),
        time: "",
        mode: "",
        audience: "",
        tags: [],
        agenda: [],
        organizer: "",
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h3 className="text-center mb-4">Create Event</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto flex justify-between items-center animate-fade-in">
          <span>✅ Event created successfully!</span>
        </div>
      )}

      <form
        className="bg-[#64363642] py-8 px-6 lg:w-2/4 m-auto flex flex-col gap-4 rounded-2xl"
        onSubmit={createEventsForm}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Event Title *</Label>
          <Input
            name="title"
            value={formData.title}
            placeholder="enter event title"
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Event Description *</Label>
          <Textarea
            name="description"
            value={formData.description}
            placeholder="enter event description"
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="overview">Event Overview *</Label>
          <Textarea
            name="overview"
            value={formData.overview}
            placeholder="enter event overview"
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="image">Event Image *</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {formData.imageFile && (
            <p className="text-sm text-gray-500">
              Selected: {formData.imageFile.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="venue">Event Venue *</Label>
          <Input
            name="venue"
            value={formData.venue}
            placeholder="enter event venue"
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="location">Event Location *</Label>
          <Input
            name="location"
            value={formData.location}
            placeholder="enter event location"
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="date">Event Date *</Label>
          <CalendarForm value={formData.date} onChange={handleDateChange} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="time">Event Time *</Label>
          <Input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="mode">Event Mode *</Label>
          <SelectDropDown
            value={formData.mode}
            onChange={(mode) => setFormData({ ...formData, mode })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="audience">Event Audience *</Label>
          <Textarea
            name="audience"
            value={formData.audience}
            placeholder="enter target audience"
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="organizer">Event Organizer *</Label>
          <Input
            name="organizer"
            value={formData.organizer}
            placeholder="enter organizer name"
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Agenda Items *</Label>
          <div className="flex gap-2">
            <Input
              value={agendaInput}
              onChange={(e) => setAgendaInput(e.target.value)}
              placeholder="Add agenda item"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAgenda();
                }
              }}
            />
            <Button type="button" onClick={addAgenda}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.agenda.map((item, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-2xl flex items-center gap-2"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeAgenda(index)}
                  className="hover:bg-blue-200 rounded-2xl p-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {formData.agenda.length === 0 && (
            <p className="text-sm text-gray-500">No agenda items added yet</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label>Tags *</Label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tag"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" onClick={addTag}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-2xl flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="hover:bg-green-200 rounded-2xl p-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {formData.tags.length === 0 && (
            <p className="text-sm text-gray-500">No tags added yet</p>
          )}
        </div>

        <Button className="button-submit" type="submit" disabled={loading}>
          {loading ? "Creating Event..." : "Create Event"}
        </Button>
      </form>
    </section>
  );
};

export default CreateEvents;
