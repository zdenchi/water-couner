export type Visit = {
  ip: string
  path: string
  at: string
}

const visits: Visit[] = []
const maxVisits = 1000

export function addVisit(visit: Visit) {
  visits.push(visit)
  if (visits.length > maxVisits) {
    visits.splice(0, visits.length - maxVisits)
  }
}

export function getVisits() {
  return visits
}
