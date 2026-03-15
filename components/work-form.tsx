"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { COURSES } from "@/lib/constants"
import { workSchema, type WorkFormValues } from "@/lib/validations/work"
import { createWork, updateWork } from "@/lib/actions/work"
import { Upload, X } from "lucide-react"
import type { WorkWithUser } from "@/lib/types"

// ============================================================
// Types
// ============================================================

type WorkFormProps = {
  work?: WorkWithUser // 渡されたら編集モード、なければ新規投稿
}

// ============================================================
// FieldError — バリデーションエラー表示用
// ============================================================

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-destructive">{message}</p>
}

// ============================================================
// WorkForm — 作品投稿・編集の共通フォーム
// ============================================================

export function WorkForm({ work }: WorkFormProps) {
  const isEdit = !!work

  // --- React Hook Form + Zod ---
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      title: work?.title ?? "",
      url: work?.url ?? "",
      githubUrl: work?.githubUrl ?? "",
      course: (work?.course as WorkFormValues["course"]) ?? undefined,
      cohort: work?.cohort ?? undefined,
      duration: work?.duration ?? "",
      techStack: work?.techStack ?? [],
      description: work?.description ?? "",
      highlight: work?.highlight ?? "",
    },
  })

  // --- 技術スタック（タグ入力） ---
  const techStack = watch("techStack")
  const [techInput, setTechInput] = useState("")

  function addTech() {
    const value = techInput.trim()
    if (value && !techStack.includes(value)) {
      setValue("techStack", [...techStack, value], { shouldValidate: true })
      setTechInput("")
    }
  }

  function removeTech(tech: string) {
    setValue(
      "techStack",
      techStack.filter((t) => t !== tech),
      { shouldValidate: true }
    )
  }

  // --- 画像アップロード（D&D + クリック） ---
  const [imagePreview, setImagePreview] = useState<string | null>(
    work?.imageKey ?? null
  )
  const [isDragging, setIsDragging] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return
    const url = URL.createObjectURL(file)
    setImagePreview(url)
    setImageFile(file)
  }, [])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  // --- 送信 ---
  async function onSubmit(data: WorkFormValues) {
    if (isEdit) {
      await updateWork(work.id, data)
    } else {
      await createWork(data)
    }
  }

  // ============================================================
  // Render
  // ============================================================

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ---- タイトル ---- */}
        <div className="space-y-3">
          <Label htmlFor="title">
            タイトル <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="作品のタイトル"
            {...register("title")}
          />
          <FieldError message={errors.title?.message} />
        </div>

        {/* ---- 作品URL ---- */}
        <div className="space-y-3">
          <Label htmlFor="url">
            作品URL <span className="text-destructive">*</span>
          </Label>
          <Input
            id="url"
            placeholder="https://example.com"
            {...register("url")}
          />
          <FieldError message={errors.url?.message} />
        </div>

        {/* ---- GitHub URL ---- */}
        <div className="space-y-3">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            placeholder="https://github.com/user/repo"
            {...register("githubUrl")}
          />
          <FieldError message={errors.githubUrl?.message} />
        </div>

        {/* ---- サムネイル画像（ドラッグ&ドロップ） ---- */}
        <div className="space-y-3">
          <Label>
            サムネイル画像 <span className="text-destructive">*</span>
          </Label>
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("image")?.click()}
            className={`relative cursor-pointer rounded-lg border-2 border-dashed transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            } ${imagePreview ? "p-2" : "p-8"}`}
          >
            {imagePreview ? (
              <div className="relative aspect-video overflow-hidden rounded-md">
                <Image
                  src={imagePreview}
                  alt="プレビュー"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="size-6" />
                <p className="text-sm">
                  ドラッグ&ドロップ または クリックして選択
                </p>
              </div>
            )}
          </div>
          <input
            id="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />
        </div>

        {/* ---- コース・期数・制作期間（3カラム） ---- */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-3">
            <Label>
              コース <span className="text-destructive">*</span>
            </Label>
            <Select
              defaultValue={work?.course}
              onValueChange={(v) =>
                setValue("course", v as WorkFormValues["course"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="選択" />
              </SelectTrigger>
              <SelectContent>
                {COURSES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.course?.message} />
          </div>

          <div className="space-y-3">
            <Label htmlFor="cohort">
              期数 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cohort"
              type="number"
              placeholder="30"
              {...register("cohort", { valueAsNumber: true })}
            />
            <FieldError message={errors.cohort?.message} />
          </div>

          <div className="space-y-3">
            <Label htmlFor="duration">
              制作期間 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="duration"
              placeholder="2ヶ月"
              {...register("duration")}
            />
            <FieldError message={errors.duration?.message} />
          </div>
        </div>

        {/* ---- 技術スタック（タグ入力） ---- */}
        <div className="space-y-3">
          <Label>
            技術スタック <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addTech()
                }
              }}
              placeholder="React, Next.js など"
            />
            <Button type="button" variant="outline" onClick={addTech}>
              追加
            </Button>
          </div>
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 rounded-md border bg-muted/50 px-2.5 py-1 text-xs font-medium"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <FieldError message={errors.techStack?.message} />
        </div>

        {/* ---- 説明 ---- */}
        <div className="space-y-3">
          <Label htmlFor="description">
            説明 <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="作品の概要を書いてください"
            rows={4}
            {...register("description")}
          />
          <FieldError message={errors.description?.message} />
        </div>

        {/* ---- 推しポイント ---- */}
        <div className="space-y-3">
          <Label htmlFor="highlight">推しポイント</Label>
          <Textarea
            id="highlight"
            placeholder="こだわった点や工夫した点"
            rows={3}
            {...register("highlight")}
          />
        </div>

        {/* ---- 送信ボタン ---- */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isEdit ? "更新する" : "投稿する"}
        </Button>
      </form>
    </Card>
  )
}
