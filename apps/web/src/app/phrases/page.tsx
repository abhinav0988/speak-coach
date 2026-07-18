"use client";

import { useEffect, useState } from "react";
import { BookMarked, Plus, Trash2, Volume2 } from "lucide-react";
import { api } from "@/lib/api";
import { PHRASE_CATEGORIES } from "@speak-coach/shared/content";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card, Badge } from "@/components/ui/primitives";

export default function PhrasesPage() {
  const [phrases, setPhrases] = useState<
    Array<{
      id: string;
      original: string;
      corrected: string;
      language: string;
      category: string;
    }>
  >([]);
  const [category, setCategory] = useState<string>("");
  const [original, setOriginal] = useState("");
  const [corrected, setCorrected] = useState("");
  const [language, setLanguage] = useState("roman_hindi");

  const load = () => {
    api.getPhrases(category || undefined).then((d) => setPhrases(d.phrases as typeof phrases));
  };

  useEffect(() => {
    load();
  }, [category]);

  const save = async () => {
    if (!original || !corrected) return;
    await api.savePhrase({ original, corrected, language, category: category || "general" });
    setOriginal("");
    setCorrected("");
    load();
  };

  const remove = async (id: string) => {
    await api.deletePhrase(id);
    load();
  };

  const speak = (text: string) => speechSynthesis.speak(new SpeechSynthesisUtterance(text));

  return (
    <div className="space-y-6">
      <PageBack href="/" />
      <PageHeader title="Phrase Library" subtitle="Save your best corrected sentences" badge="Library" />

      <div className="flex flex-wrap gap-2">
        <Button variant={!category ? "primary" : "secondary"} onClick={() => setCategory("")}>
          All
        </Button>
        {PHRASE_CATEGORIES.map((c) => (
          <Button key={c} variant={category === c ? "primary" : "secondary"} onClick={() => setCategory(c)}>
            {c}
          </Button>
        ))}
      </div>

      <Card className="space-y-3">
        <h2 className="flex items-center gap-2 font-semibold text-foreground">
          <Plus className="h-5 w-5 text-primary" />
          Add Phrase
        </h2>
        <input className="input" placeholder="Original (wrong)" value={original} onChange={(e) => setOriginal(e.target.value)} />
        <input className="input" placeholder="Corrected" value={corrected} onChange={(e) => setCorrected(e.target.value)} />
        <Button onClick={save}>Save Phrase</Button>
      </Card>

      <div className="space-y-3">
        {phrases.length === 0 ? (
          <Card className="text-center text-muted">
            <BookMarked className="mx-auto mb-2 h-8 w-8 opacity-50" />
            No phrases saved yet.
          </Card>
        ) : (
          phrases.map((p) => (
            <Card key={p.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="secondary">{p.category}</Badge>
                  <p className="mt-2 text-danger line-through">{p.original}</p>
                  <p className="font-medium text-success">{p.corrected}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" className="px-3" onClick={() => speak(p.corrected)}>
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" className="text-danger" onClick={() => remove(p.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
