from datetime import datetime

STATSAPI_NHL_BASE_URL = "https://statsapi.web.nhl.com/"

STATSAPI_NHL_PEOPLE_SUFFIX = "api/v1/people/"
# follwed by ID# gives personal details
# and more infromation with more endpoints:
STATSAPI_NHL_SEASON_STATS_ENDPOINT = "/stats=statsSingleSeason&season="
# with the season number in 2 4-digit years (e.g. 20212022 refers to 2021-2 season)

SEASON_THIS = f'{str(datetime.now().year)}{str(datetime.now().year+1)}' if datetime.now().month > 7 else f'{str(datetime.now().year-1)}{str(datetime.now().year)}'
SEASON_LAST = f'{str(datetime.now().year-1)}{str(datetime.now().year)}' if datetime.now().month > 7 else f'{str(datetime.now().year-2)}{str(datetime.now().year-1)}'
# assumes one season ends on or before July 31 and the next starts on or after August 1

STATSAPI_NHL_TEAMS_SUFFIX = "f"
# returns all teams or a team with ID added to URL
STATSAPI_NHL_TEAM_ROSTER = "?expand=team.roster"
# player_id = f"teams[0].roster.roster[{i}].person.id"
# player_page_suffix = f"teams[0].roster.roster[{i}].person.link"
# f"{STATS_NHL_BASE_URL}{player_page_suffix}" goes that that player's page
