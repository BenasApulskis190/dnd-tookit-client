import type { Component } from 'vue'
import type { ClassName } from './types'
import ArtificerIcon from './components/ArtificerIcon.vue'
import BarbarianIcon from './components/BarbarianIcon.vue'
import BardIcon from './components/BardIcon.vue'
import ClericIcon from './components/ClericIcon.vue'
import DruidIcon from './components/DruidIcon.vue'
import FighterIcon from './components/FighterIcon.vue'
import MonkIcon from './components/MonkIcon.vue'
import PaladinIcon from './components/PaladinIcon.vue'
import RangerIcon from './components/RangerIcon.vue'
import RogueIcon from './components/RogueIcon.vue'
import SorcererIcon from './components/SorcererIcon.vue'
import WarlockIcon from './components/WarlockIcon.vue'
import WizardIcon from './components/WizardIcon.vue'

const classIconMap: Record<Lowercase<ClassName>, Component> = {
  artificer: ArtificerIcon,
  barbarian: BarbarianIcon,
  bard: BardIcon,
  cleric: ClericIcon,
  druid: DruidIcon,
  fighter: FighterIcon,
  monk: MonkIcon,
  paladin: PaladinIcon,
  ranger: RangerIcon,
  rogue: RogueIcon,
  sorcerer: SorcererIcon,
  warlock: WarlockIcon,
  wizard: WizardIcon,
}

export function useClassIcons() {
  function getClassIcon(name: string): Component | undefined {
    return classIconMap[name.toLowerCase() as Lowercase<ClassName>]
  }

  return { getClassIcon }
}
