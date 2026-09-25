export interface ApiResponse<T> {
    get: string,
    parameters: Record<string, string>,
    errors: unknown,
    results: number,
    paging: {
        current: number,
        total: number
    },
    response: T[]
}

export interface FixtureInfo {
    fixture: Fixture,
    league: League,
    teams: Teams,
    goals: Goals,
    score: Score,
}

export interface Fixture {
    id: number,
    referee: string | null,
    timezone: string,
    date: string,
    venue: Venue,
    status: Status,
    timestamp: number
}

interface Venue {
    id: number | null,
    name: string | null,
    city: string | null
}

interface Status {
    long: string,
    short: string,
    elapsed: number | null,
    extra: number | null
}

export interface League {
    id: number,
    name: string,
    country: string,
    logo: string,
    flag: string | null,
    season: number,
    round: string,
    standings: boolean | null
}

interface Teams {
    home: Team,
    away: Team
}

interface Team {
    id: number,
    name: string,
    logo: string | null,
    winner: boolean | null
}

export interface Goals {
    home: number | null,
    away: number | null
}

interface Score {
    halftime: Time,
    fulltime: Time,
    extratime: Time,
    penalty: Time
}

interface Time {
    home: number | null,
    away: number | null
}

export interface LeagueGroup {
    league: League,
    matches: FixtureInfo[]
}