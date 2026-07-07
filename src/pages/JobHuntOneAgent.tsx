import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles/JOBHUNT/JobHuntOneAgent.css'

type WorkMode = 'Remote' | 'Hybrid' | 'On-site'
type Seniority = 'Entry' | 'Mid' | 'Senior' | 'Lead'
type FocusMode = 'Resume' | 'Outreach' | 'Interview'
type ApplicationStatus = 'Saved' | 'Applied' | 'Interview' | 'Offer'

interface CandidateProfile {
  targetRole: string
  company: string
  location: string
  workMode: WorkMode
  seniority: Seniority
  yearsExperience: string
  skills: string
  resumeHighlights: string
  jobDescription: string
}

interface AgentMessage {
  id: string
  role: 'agent' | 'user'
  text: string
}

interface ApplicationItem {
  id: string
  company: string
  role: string
  status: ApplicationStatus
  nextStep: string
  dueDate: string
  fitScore: number
  source?: string
  url?: string
  description?: string
}

interface SavedSession {
  id: string
  savedAt: string
  profile: CandidateProfile
  focusMode: FocusMode
  applications: ApplicationItem[]
  fitScore: number
}

interface CapturedPortalJob {
  id?: string
  source?: string
  title?: string
  company?: string
  location?: string
  description?: string
  url?: string
  capturedAt?: string
}

interface ExtensionJobsMessage {
  source?: string
  type?: string
  jobs?: CapturedPortalJob[]
}

const STORAGE_KEY = 'jobhuntOneAgentSessions'

const defaultProfile: CandidateProfile = {
  targetRole: 'Frontend Developer',
  company: 'Target Company',
  location: 'Remote or Hyderabad',
  workMode: 'Hybrid',
  seniority: 'Mid',
  yearsExperience: '3',
  skills: 'React, TypeScript, Vite, CSS, Supabase, REST APIs',
  resumeHighlights:
    'Built responsive React applications, improved page performance, connected Supabase authentication, and shipped production UI updates.',
  jobDescription:
    'We are hiring a frontend developer with React, TypeScript, API integration, performance tuning, accessibility, and clean component architecture experience.',
}

const defaultApplications: ApplicationItem[] = [
  {
    id: 'seed-saved',
    company: 'Target Company',
    role: 'Frontend Developer',
    status: 'Saved',
    nextStep: 'Tailor resume bullets',
    dueDate: '',
    fitScore: 78,
  },
]

const focusModes: FocusMode[] = ['Resume', 'Outreach', 'Interview']
const workModes: WorkMode[] = ['Remote', 'Hybrid', 'On-site']
const seniorityLevels: Seniority[] = ['Entry', 'Mid', 'Senior', 'Lead']

const stopWords = new Set([
  'and',
  'are',
  'for',
  'the',
  'with',
  'you',
  'your',
  'our',
  'will',
  'have',
  'from',
  'this',
  'that',
  'role',
  'team',
  'work',
  'experience',
  'developer',
  'engineer',
  'hiring',
])

const parseList = (value: string) =>
  value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean)

const unique = (items: string[]) => Array.from(new Set(items))

const getJobKeywords = (description: string) => {
  const words = description
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !stopWords.has(word))

  return unique(words).slice(0, 16)
}

const getMatchedSkills = (profile: CandidateProfile) => {
  const skills = parseList(profile.skills)
  const description = profile.jobDescription.toLowerCase()

  return skills.filter((skill) => description.includes(skill.toLowerCase()))
}

const getMissingKeywords = (profile: CandidateProfile) => {
  const skillText = profile.skills.toLowerCase()
  const resumeText = profile.resumeHighlights.toLowerCase()

  return getJobKeywords(profile.jobDescription).filter(
    (keyword) => !skillText.includes(keyword) && !resumeText.includes(keyword),
  )
}

const getFitScore = (profile: CandidateProfile) => {
  const skills = parseList(profile.skills)
  const matchedSkills = getMatchedSkills(profile)
  const missingKeywords = getMissingKeywords(profile)
  const experience = Number.parseFloat(profile.yearsExperience) || 0

  let score = 48
  score += Math.min(matchedSkills.length * 7, 28)
  score += Math.min(skills.length * 2, 14)
  score += Math.min(experience * 2, 12)
  score += profile.resumeHighlights.length > 100 ? 8 : 0
  score += profile.targetRole.trim() ? 4 : 0
  score -= Math.min(missingKeywords.length * 3, 18)

  return Math.max(32, Math.min(98, Math.round(score)))
}

const getScoreLabel = (score: number) => {
  if (score >= 82) return 'Strong fit'
  if (score >= 68) return 'Competitive'
  if (score >= 52) return 'Needs tuning'
  return 'Needs rebuild'
}

const formatDueDate = (dueDate: string) => {
  if (!dueDate) {
    return 'No date set'
  }

  return new Date(`${dueDate}T00:00:00`).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  })
}

const buildPlan = (profile: CandidateProfile, focusMode: FocusMode) => {
  const matched = getMatchedSkills(profile)
  const missing = getMissingKeywords(profile).slice(0, 4)
  const role = profile.targetRole || 'target role'
  const company = profile.company || 'target company'

  if (focusMode === 'Outreach') {
    return [
      `Send 5 messages to ${role} hiring managers or team leads.`,
      `Open with ${matched[0] || 'your strongest matching skill'} and one measurable result.`,
      `Ask for one clear action: referral, recruiter intro, or hiring-manager review.`,
      `Follow up in 3 business days with one new proof point.`,
    ]
  }

  if (focusMode === 'Interview') {
    return [
      `Prepare a 60-second story for why ${company} and why ${role}.`,
      `Build 3 STAR answers around ownership, ambiguity, and delivery.`,
      `Practice one technical screen using ${matched.slice(0, 2).join(' and ') || 'your core skills'}.`,
      `Prepare questions about team goals, success metrics, and onboarding.`,
    ]
  }

  return [
    `Rewrite the resume headline toward ${role}.`,
    `Move ${matched.slice(0, 3).join(', ') || 'matching skills'} into the top third of the resume.`,
    `Add missing keywords: ${missing.length ? missing.join(', ') : 'no major gaps detected'}.`,
    `Turn one project into a result bullet with scope, action, and measurable outcome.`,
  ]
}

const buildOutreachDraft = (profile: CandidateProfile) => {
  const matched = getMatchedSkills(profile)
  const proofPoint = profile.resumeHighlights.split(/[.!?]/)[0]?.trim() || 'I have shipped production work in this space'
  const role = profile.targetRole || 'the open role'
  const company = profile.company || 'your team'

  return `Hi [Name],

I saw ${company} is hiring for ${role}. My background lines up with ${matched.slice(0, 3).join(', ') || 'the core requirements'}.

${proofPoint}. I would value a quick pointer on whether my profile is worth routing to the team.

Thanks,
[Your Name]`
}

const getAgentReply = (prompt: string, profile: CandidateProfile, focusMode: FocusMode, fitScore: number) => {
  const lowerPrompt = prompt.toLowerCase()
  const missing = getMissingKeywords(profile).slice(0, 5)
  const matched = getMatchedSkills(profile).slice(0, 5)

  if (lowerPrompt.includes('resume')) {
    return `Resume priority: aim the top third at ${profile.targetRole}. Keep ${matched.join(', ') || 'your closest matching skills'} visible, then add ${missing.join(', ') || 'one more role-specific proof point'} where the job description asks for it.`
  }

  if (lowerPrompt.includes('interview')) {
    return `Interview priority: prepare 3 stories that prove ${matched.slice(0, 3).join(', ') || 'role fit'}. Anchor each answer with the business problem, your decision, and the result.`
  }

  if (lowerPrompt.includes('message') || lowerPrompt.includes('outreach') || lowerPrompt.includes('referral')) {
    return `Outreach priority: lead with fit score ${fitScore} and one proof point. Keep the ask simple: "Would you be open to pointing me to the right recruiter or referral path?"`
  }

  if (lowerPrompt.includes('gap') || lowerPrompt.includes('missing')) {
    return `The current gaps are ${missing.join(', ') || 'light'}. Fill them with resume language only when you can back each phrase with real work.`
  }

  return `For ${focusMode.toLowerCase()}, the next best move is: ${buildPlan(profile, focusMode)[0]} Your current match reads as ${getScoreLabel(fitScore).toLowerCase()} at ${fitScore}.`
}

const loadSavedSessions = (): SavedSession[] => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)

    if (!saved) {
      return []
    }

    return JSON.parse(saved) as SavedSession[]
  } catch {
    return []
  }
}

export default function JobHuntOneAgent() {
  const [profile, setProfile] = useState<CandidateProfile>(defaultProfile)
  const [focusMode, setFocusMode] = useState<FocusMode>('Resume')
  const [applications, setApplications] = useState<ApplicationItem[]>(defaultApplications)
  const [prompt, setPrompt] = useState('')
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>(() => loadSavedSessions())
  const [extensionImportStatus, setExtensionImportStatus] = useState('Install the extension to import captured jobs.')
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'agent-ready',
      role: 'agent',
      text: 'JobHunt One is ready with a resume-first plan for the current target role.',
    },
  ])

  const fitScore = useMemo(() => getFitScore(profile), [profile])
  const matchedSkills = useMemo(() => getMatchedSkills(profile), [profile])
  const missingKeywords = useMemo(() => getMissingKeywords(profile), [profile])
  const plan = useMemo(() => buildPlan(profile, focusMode), [focusMode, profile])
  const outreachDraft = useMemo(() => buildOutreachDraft(profile), [profile])
  const nextDeadline = useMemo(() => {
    const nextApplication = applications
      .filter((item) => item.dueDate)
      .sort((first, second) => first.dueDate.localeCompare(second.dueDate))[0]

    return formatDueDate(nextApplication?.dueDate || '')
  }, [applications])

  const scoreRingStyle = { '--score': fitScore } as CSSProperties

  useEffect(() => {
    const requestExtensionJobs = () => {
      window.postMessage(
        {
          source: 'jobhunt-one-workspace',
          type: 'JOBHUNT_REQUEST_EXTENSION_JOBS',
        },
        window.location.origin,
      )
    }

    const handleExtensionJobs = (event: MessageEvent) => {
      if (event.source !== window) {
        return
      }

      const message = event.data as ExtensionJobsMessage

      if (
        message?.source !== 'jobhunt-one-extension' ||
        message.type !== 'JOBHUNT_EXTENSION_JOBS' ||
        !Array.isArray(message.jobs)
      ) {
        return
      }

      if (!message.jobs.length) {
        setExtensionImportStatus('Extension connected. No captured jobs yet.')
        return
      }

      const capturedJobs = message.jobs

      setApplications((current) => {
        const existingUrls = new Set(current.map((item) => item.url).filter(Boolean))
        const importedApplications = capturedJobs
          .filter((job) => job.url && !existingUrls.has(job.url))
          .map((job) => {
            const importedProfile: CandidateProfile = {
              ...profile,
              targetRole: job.title || profile.targetRole,
              company: job.company || profile.company,
              location: job.location || profile.location,
              jobDescription: job.description || profile.jobDescription,
            }

            return {
              id: job.id || crypto.randomUUID(),
              company: job.company || 'Captured company',
              role: job.title || 'Captured job',
              status: 'Saved' as ApplicationStatus,
              nextStep: `Tailor resume for ${job.source || 'job portal'} posting`,
              dueDate: '',
              fitScore: getFitScore(importedProfile),
              source: job.source,
              url: job.url,
              description: job.description,
            }
          })

        setExtensionImportStatus(
          importedApplications.length
            ? `Imported ${importedApplications.length} captured job${importedApplications.length === 1 ? '' : 's'}.`
            : `${capturedJobs.length} captured job${capturedJobs.length === 1 ? '' : 's'} already loaded.`,
        )

        if (!importedApplications.length) {
          return current
        }

        return [...importedApplications, ...current]
      })
    }

    window.addEventListener('message', handleExtensionJobs)
    requestExtensionJobs()
    const retryTimer = window.setTimeout(requestExtensionJobs, 900)

    return () => {
      window.removeEventListener('message', handleExtensionJobs)
      window.clearTimeout(retryTimer)
    }
  }, [profile])

  const updateProfile = <Key extends keyof CandidateProfile>(field: Key, value: CandidateProfile[Key]) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const addAgentMessage = (text: string) => {
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: 'agent',
        text,
      },
    ])
  }

  const runAgent = () => {
    addAgentMessage(
      `${getScoreLabel(fitScore)} at ${fitScore}. ${plan[0]} ${missingKeywords.length ? `Watch these gaps: ${missingKeywords.slice(0, 4).join(', ')}.` : 'The keyword match is tight.'}`,
    )
  }

  const handlePromptSubmit = () => {
    if (!prompt.trim()) return

    const userPrompt = prompt.trim()
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: 'user',
        text: userPrompt,
      },
      {
        id: crypto.randomUUID(),
        role: 'agent',
        text: getAgentReply(userPrompt, profile, focusMode, fitScore),
      },
    ])
    setPrompt('')
  }

  const addApplication = () => {
    const newApplication: ApplicationItem = {
      id: crypto.randomUUID(),
      company: profile.company || 'New company',
      role: profile.targetRole || 'Target role',
      status: 'Saved',
      nextStep: plan[0],
      dueDate: '',
      fitScore,
    }

    setApplications((current) => [newApplication, ...current])
  }

  const updateApplication = <Key extends keyof ApplicationItem>(id: string, field: Key, value: ApplicationItem[Key]) => {
    setApplications((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    )
  }

  const saveSession = () => {
    const nextSession: SavedSession = {
      id: crypto.randomUUID(),
      savedAt: new Date().toISOString(),
      profile,
      focusMode,
      applications,
      fitScore,
    }
    const nextSessions = [nextSession, ...savedSessions].slice(0, 5)

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSessions))
    setSavedSessions(nextSessions)
    addAgentMessage('Session saved. Keep the next action visible and move one application forward today.')
  }

  const resetWorkspace = () => {
    setProfile(defaultProfile)
    setFocusMode('Resume')
    setApplications(defaultApplications)
    setMessages([
      {
        id: 'agent-reset',
        role: 'agent',
        text: 'Workspace reset to the starter job search plan.',
      },
    ])
  }

  return (
    <div className="jobhunt-page">
      <Navbar />
      <main className="jobhunt-main">
        <section className="jobhunt-workspace" aria-labelledby="jobhunt-title">
          <div className="jobhunt-header">
            <div>
              <p className="jobhunt-kicker">JobHunt One Agent</p>
              <h1 id="jobhunt-title">Job search command center</h1>
            </div>
            <div className="jobhunt-actions">
              <button className="jobhunt-icon-button" type="button" onClick={runAgent} title="Run agent analysis">
                Run
              </button>
              <button className="jobhunt-icon-button" type="button" onClick={saveSession} title="Save session">
                Save
              </button>
              <button className="jobhunt-icon-button muted" type="button" onClick={resetWorkspace} title="Reset workspace">
                Reset
              </button>
            </div>
          </div>

          <div className="jobhunt-grid">
            <section className="jobhunt-panel profile-panel" aria-label="Candidate profile">
              <div className="jobhunt-panel-heading">
                <h2>Target</h2>
                <div className="jobhunt-segments" aria-label="Focus mode">
                  {focusModes.map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      className={focusMode === mode ? 'active' : ''}
                      onClick={() => setFocusMode(mode)}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="jobhunt-form-grid">
                <label>
                  <span>Role</span>
                  <input value={profile.targetRole} onChange={(event) => updateProfile('targetRole', event.target.value)} />
                </label>
                <label>
                  <span>Company</span>
                  <input value={profile.company} onChange={(event) => updateProfile('company', event.target.value)} />
                </label>
                <label>
                  <span>Location</span>
                  <input value={profile.location} onChange={(event) => updateProfile('location', event.target.value)} />
                </label>
                <label>
                  <span>Work Mode</span>
                  <select
                    value={profile.workMode}
                    onChange={(event) => updateProfile('workMode', event.target.value as WorkMode)}
                  >
                    {workModes.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Seniority</span>
                  <select
                    value={profile.seniority}
                    onChange={(event) => updateProfile('seniority', event.target.value as Seniority)}
                  >
                    {seniorityLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Years</span>
                  <input
                    type="number"
                    min="0"
                    value={profile.yearsExperience}
                    onChange={(event) => updateProfile('yearsExperience', event.target.value)}
                  />
                </label>
              </div>

              <label className="jobhunt-wide-field">
                <span>Skills</span>
                <textarea value={profile.skills} onChange={(event) => updateProfile('skills', event.target.value)} rows={3} />
              </label>
              <label className="jobhunt-wide-field">
                <span>Resume Highlights</span>
                <textarea
                  value={profile.resumeHighlights}
                  onChange={(event) => updateProfile('resumeHighlights', event.target.value)}
                  rows={4}
                />
              </label>
              <label className="jobhunt-wide-field">
                <span>Job Description</span>
                <textarea
                  value={profile.jobDescription}
                  onChange={(event) => updateProfile('jobDescription', event.target.value)}
                  rows={5}
                />
              </label>
            </section>

            <section className="jobhunt-panel agent-panel" aria-label="Agent output">
              <div className="score-board">
                <div className="score-ring" style={scoreRingStyle}>
                  <span>{fitScore}</span>
                  <small>{getScoreLabel(fitScore)}</small>
                </div>
                <div className="score-details">
                  <div>
                    <strong>{matchedSkills.length}</strong>
                    <span>Matched Skills</span>
                  </div>
                  <div>
                    <strong>{applications.length}</strong>
                    <span>Applications</span>
                  </div>
                  <div>
                    <strong>{nextDeadline}</strong>
                    <span>Next Deadline</span>
                  </div>
                </div>
              </div>

              <div className="agent-plan">
                <h2>{focusMode} Plan</h2>
                <div className="plan-list">
                  {plan.map((item, index) => (
                    <article className="plan-item" key={item}>
                      <span>{index + 1}</span>
                      <p>{item}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="keyword-strip" aria-label="Keyword matches">
                {matchedSkills.map((skill) => (
                  <span className="match" key={skill}>
                    {skill}
                  </span>
                ))}
                {missingKeywords.slice(0, 5).map((keyword) => (
                  <span className="gap" key={keyword}>
                    {keyword}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <div className="jobhunt-lower-grid">
            <section className="jobhunt-panel chat-panel" aria-label="Agent chat">
              <div className="jobhunt-panel-heading">
                <h2>Agent</h2>
                <span>{focusMode}</span>
              </div>
              <div className="agent-messages">
                {messages.map((message) => (
                  <div className={`agent-message ${message.role}`} key={message.id}>
                    {message.text}
                  </div>
                ))}
              </div>
              <div className="agent-input-row">
                <input
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handlePromptSubmit()
                  }}
                  placeholder="Ask about resume, outreach, interview, or gaps"
                />
                <button type="button" onClick={handlePromptSubmit} title="Send to agent">
                  Send
                </button>
              </div>
            </section>

            <section className="jobhunt-panel outreach-panel" aria-label="Outreach draft">
              <div className="jobhunt-panel-heading">
                <h2>Outreach</h2>
                <button type="button" onClick={addApplication} title="Add application">
                  + Add
                </button>
              </div>
              <textarea value={outreachDraft} readOnly rows={8} />
              <div className="saved-sessions">
                <h3>Saved Sessions</h3>
                {savedSessions.length ? (
                  savedSessions.map((session) => (
                    <button
                      key={session.id}
                      type="button"
                      onClick={() => {
                        setProfile(session.profile)
                        setFocusMode(session.focusMode)
                        setApplications(session.applications)
                      }}
                    >
                      {new Date(session.savedAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      <span>{session.fitScore}</span>
                    </button>
                  ))
                ) : (
                  <p>No saved sessions yet</p>
                )}
              </div>
            </section>

            <section className="jobhunt-panel tracker-panel" aria-label="Application tracker">
              <div className="jobhunt-panel-heading">
                <h2>Tracker</h2>
                <span>{applications.length} active</span>
              </div>
              <p className="extension-import-status">{extensionImportStatus}</p>
              <div className="application-list">
                {applications.map((application) => (
                  <article className="application-card" key={application.id}>
                    <div>
                      <h3>{application.company}</h3>
                      <p>{application.role}</p>
                      {application.url ? (
                        <a className="application-source" href={application.url} target="_blank" rel="noreferrer">
                          {application.source || 'Captured job'}
                        </a>
                      ) : null}
                    </div>
                    <div className="application-meta">
                      <span>{application.fitScore}</span>
                      <select
                        value={application.status}
                        onChange={(event) => updateApplication(application.id, 'status', event.target.value as ApplicationStatus)}
                      >
                        <option value="Saved">Saved</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                      </select>
                    </div>
                    <label className="application-date">
                      <span>Due</span>
                      <input
                        type="date"
                        value={application.dueDate}
                        onChange={(event) => updateApplication(application.id, 'dueDate', event.target.value)}
                      />
                    </label>
                    <label className="next-step-field">
                      <span>Next Step</span>
                      <input
                        value={application.nextStep}
                        onChange={(event) => updateApplication(application.id, 'nextStep', event.target.value)}
                      />
                    </label>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
