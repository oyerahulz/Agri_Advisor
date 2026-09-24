import os

lines = []
def w(*args): lines.append("".join(str(a) for a in args))

# ── lib/diseases.ts ──────────────────────────────────────────────────────────
w("export interface Disease {")
w("  id: string;")
w("  nameHi: string;")
w("  nameEn: string;")
w("  type: 'fungal' | 'pest' | 'viral' | 'bacterial';")
w("  cropId: string;")
w("  cropEmoji: string;")
w("  cropHi: string;")
w("  symptomsHi: string;")
w("  symptomsEn: string;")
w("  preventionHi: string;")
w("  preventionEn: string;")
w("  organicHi: string;")
w("  organicEn: string;")
w("  chemicalHi: string;")
w("  chemicalEn: string;")
w("}")
w("")
w("export const DISEASES: Disease[] = [")
