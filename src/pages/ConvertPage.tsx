import { useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Button } from '../components/Button'
import { getPlanById } from '../data/plans'
import { getAllowedConversions, getTargetsForSource } from '../data/conversions'
import { useAuth } from '../hooks/use-auth'
import { useConversions } from '../hooks/use-conversions'
import { formatDateTime, formatFileSize } from '../utils/format'
import type { PlanId } from '../data/plans'

const conversionFormSchema = z.object({
  file: z.instanceof(File, { message: 'Selecione um arquivo válido.' }),
  target: z.string().min(1, 'Selecione o formato de destino.'),
})

type ConversionFormValues = z.infer<typeof conversionFormSchema>

const EMPTY_FILE = undefined as unknown as File

export function ConvertPage() {
  const { user } = useAuth()
  const { conversions, activeConversions, startConversion } = useConversions()
  const [message, setMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const planId: PlanId = user?.plan ?? 'free'
  const plan = getPlanById(planId)
  const allowedFormats = getAllowedConversions(planId)

  const sourceOptions = useMemo(() => {
    const uniqueSources = Array.from(new Set(allowedFormats.map((format) => format.from)))
    return uniqueSources.sort()
  }, [allowedFormats])

  const {
    handleSubmit,
    setValue,
    register,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ConversionFormValues>({
    resolver: zodResolver(conversionFormSchema),
    defaultValues: {
      file: EMPTY_FILE,
      target: '',
    },
  })

  const watchedFile = watch('file')
  const selectedFile = watchedFile instanceof File ? watchedFile : null
  const selectedTarget = watch('target')

  const availableTargets = useMemo(() => {
    if (!selectedFile) {
      return []
    }
    const extension = selectedFile.name.split('.').pop()?.toLowerCase()
    if (!extension) {
      return []
    }
    return getTargetsForSource(planId, extension)
  }, [planId, selectedFile])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setMessage(null)

    if (!file) {
      setValue('file', EMPTY_FILE, { shouldValidate: true })
      setValue('target', '', { shouldValidate: true })
      clearErrors('file')
      return
    }

    const sourceExtension = file.name.split('.').pop()?.toLowerCase()
    if (!sourceExtension) {
      setValue('file', EMPTY_FILE, { shouldValidate: true })
      setValue('target', '', { shouldValidate: true })
      setError('file', { type: 'manual', message: 'Não foi possível identificar o formato do arquivo.' })
      return
    }

    const targets = getTargetsForSource(planId, sourceExtension)
    if (!targets.length) {
      setValue('file', EMPTY_FILE, { shouldValidate: true })
      setValue('target', '', { shouldValidate: true })
      setError(
        'file',
        {
          type: 'manual',
          message: 'Esse formato nao está liberado para o plano atual. Faça upgrade para liberar mais opcões.',
        },
      )
      return
    }

    clearErrors('file')
    setValue('file', file, { shouldDirty: true, shouldValidate: true })
    setValue('target', targets[0].id, { shouldDirty: true, shouldValidate: true })
  }

  const onSubmit = (data: ConversionFormValues) => {
    const format = allowedFormats.find((item) => item.id === data.target)
    if (!format) {
      setError('target', { type: 'manual', message: 'O formato selecionado nao faz parte deste plano.' })
      return
    }

    const result = startConversion({
      file: data.file,
      targetFormat: format.to,
      planId,
    })

    if (!result.success) {
      setMessage(result.message)
      return
    }

    setMessage(`Conversão iniciada com prioridade ${plan.limits.priorityLabel.toLowerCase()}.`)
    reset({ file: EMPTY_FILE, target: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleReset = () => {
    reset({ file: EMPTY_FILE, target: '' })
    setMessage(null)
    clearErrors()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const targetField = register('target')

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <header className="space-y-3">
          <h2 className="text-3xl font-semibold text-white">Converter arquivos</h2>
          <p className="max-w-2xl text-sm text-slate-300">
            O FileFlow simula a fila real de conversao enquanto conectamos a API externa. Controle limites de tamanho e simultaneidade de acordo com seu plano atual.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
          >
            <div className="space-y-3">
              <label
                htmlFor="fileInput"
                className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-cyan-500/40 bg-slate-950/40 px-6 py-10 text-center text-slate-300 transition hover:border-cyan-400 hover:bg-slate-950/60"
              >
                <span className="rounded-full bg-cyan-500/10 px-4 py-1 text-xs font-semibold text-cyan-200">
                  Arraste e solte ou clique para selecionar
                </span>
                <p className="text-base font-medium text-white">
                  {selectedFile ? selectedFile.name : 'Escolha um arquivo para converter'}
                </p>
                <span className="text-xs text-slate-400">
                  Tamanho máximo: {plan.limits.maxFileSizeMB ? `${plan.limits.maxFileSizeMB} MB` : 'Ilimitado'}
                </span>
              </label>
              <input
                id="fileInput"
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept={sourceOptions.map((ext) => `.${ext}`).join(',')}
              />
              {errors.file && (
                <p className="text-xs font-medium text-red-300">{errors.file.message}</p>
              )}
            </div>

            {selectedFile && availableTargets.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-slate-400">Formato de origem</span>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
                    {selectedFile.name.split('.').pop()?.toUpperCase()}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-400" htmlFor="target">
                    Converter para
                  </label>
                  <select
                    id="target"
                    {...targetField}
                    value={selectedTarget}
                    onChange={(event) => {
                      targetField.onChange(event)
                      clearErrors('target')
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
                  >
                    <option value="" disabled>
                      Selecione o formato
                    </option>
                    {availableTargets.map((target) => (
                      <option key={target.id} value={target.id}>
                        {target.label}
                      </option>
                    ))}
                  </select>
                  {errors.target && (
                    <p className="text-xs font-medium text-red-300">{errors.target.message}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-950/60 p-4 text-xs text-slate-300">
              <span>
                Limite de simultaneidade:{' '}
                <strong>{plan.limits.maxConcurrent ? plan.limits.maxConcurrent : 'Ilimitado'}</strong>
              </span>
              <span>
                Ativas agora: <strong>{activeConversions.length}</strong>
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button type="submit" disabled={!selectedFile || !availableTargets.length}>
                Iniciar conversão
              </Button>
              <Button type="button" variant="secondary" onClick={handleReset}>
                Limpar seleção
              </Button>
            </div>

            {message && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-emerald-200">
                {message}
              </div>
            )}
          </form>

          <aside className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">Seu plano atual</h3>
              <p className="text-sm text-slate-400">{plan.description}</p>
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>- {plan.limits.maxFileSizeMB ? `${plan.limits.maxFileSizeMB} MB por arquivo` : 'Arquivos ilimitados'}</li>
              <li>- {plan.limits.maxConcurrent ? `${plan.limits.maxConcurrent} tarefas simultâneas` : 'Conversões ilimitadas'}</li>
              <li>- Prioridade: {plan.limits.priorityLabel}</li>
            </ul>
            {!user && (
              <div className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-4 text-sm text-cyan-100">
                Faça login para desbloquear planos pagos e acelerar suas filas.
                <Link to="/login" className="ml-1 font-semibold text-cyan-200 underline">
                  Simular login
                </Link>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold text-white">Histórico recente</h3>
          <span className="text-xs uppercase tracking-widest text-slate-400">Últimas 8 conversões</span>
        </div>
        <div className="mt-6 space-y-4">
          {conversions.slice(0, 8).map((conversion) => (
            <article
              key={conversion.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 md:p-5"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">{conversion.fileName}</h4>
                  <p className="text-xs text-slate-400">
                    {conversion.sourceFormat.toUpperCase()} {'->'} {conversion.targetFormat.toUpperCase()} -{' '}
                    {formatFileSize(conversion.sizeMB)}
                  </p>
                </div>
                <span className="rounded-full border border-slate-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-200">
                  {conversion.planUsed}
                </span>
              </div>
              {conversion.status === 'completed' && conversion.downloadUrl && (
                <div className="mt-3">
                  <a
                    href={conversion.downloadUrl}
                    download={conversion.downloadFileName ?? conversion.fileName}
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
                  >
                    Baixar arquivo convertido
                  </a>
                </div>
              )}

              <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full ${
                      conversion.status === 'completed'
                        ? 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                        : 'bg-gradient-to-r from-slate-500 to-slate-200'
                    }`}
                    style={{ width: `${conversion.progress}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">
                  {conversion.status === 'completed'
                    ? `Concluido em ${formatDateTime(conversion.completedAt ?? conversion.createdAt)}`
                    : `Iniciado as ${formatDateTime(conversion.createdAt)}`}
                </span>
              </div>
            </article>
          ))}

          {conversions.length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-10 text-center text-sm text-slate-400">
              Nenhuma conversão registrada ainda. Selecione um arquivo acima para começar.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
