# MeetOn — contexte UX

Synthèse du « handbook » de la maquette Figma (section `handbook`, fichier `ktMvSbigsFexXJ4Co1kPHh`).
Sert de référence produit pour toutes les décisions d'UI et de fonctionnalités.

## Promesse (Product box)

> **Vivre ses cercles : discuter, partager, se voir… et ne pas s'oublier.**

| Ce que MeetOn fait | Ce que MeetOn ne fait pas |
|---|---|
| **Gestion de cercle** (les « tribus ») | **Intermédiation** : pas de rencontre d'inconnus (≠ Tinder, Bumble, Hoop) |
| **Lieu d'échange** (chat, partage) | **Network** : pas de réseau social ouvert (≠ Facebook) |
| **Organisation d'events et logistique** | |
| **Se souvenir** (albums, souvenirs) | |

Positionnement : un **cercle proche et déjà existant**, avec un **objectif défini** (se voir, organiser). C'est la case vide entre WhatsApp/Signal (proche mais sans objectif), Meetup/Strava/Discord (objectif mais cercle lointain) et Lepotcommun (budget seul).

## User journey (ordre de construction)

1. **Rassembler** : créer un cercle → inviter → personnaliser ✅ *(fait : sign in + création de tribu)*
2. **Échanger** : discuter → prévoir → partager un album
3. **Organiser** : créer un event → ajouter des membres → logistique → partager les photos de la soirée
4. **Se souvenir** : retrouver les albums de la soirée

## Ce que la recherche a fait ressortir (focus group)

- **Fondamentaux** : réseau proche, cercle de confiance, échanger, se réunir, garder des souvenirs.
- **Cercles** : famille / amis / collègues / passion. Ils ont une durée de vie et une ancienneté, plus ou moins d'intimité, et un besoin d'échanger et de se réunir.
- **Rythme de vie** : l'âge et le stade de vie (célibataire / couple / parents) changent la disponibilité. Les cercles s'éloignent avec le temps, et les aléas de la vie s'en mêlent.
- **Décision** : « on fait quoi ? », transformer le « faudrait qu'on… » en concret, choisir une activité ou un lieu, **choisir une date**, répartir les rôles.
- **Budget et fournitures** : **qui prend quoi ? qui paye quoi ?** Le pot commun est difficile à gérer, il faut courir après les gens et anticiper les budgets.
- **Contraintes** : éloignement, enfants, changements de statut, séparations.
- **Limites** : vie privée, taille du groupe, events commerciaux déguisés, applis de rencontre peu utiles.
- **Irritant cité** : « la conversation WhatsApp chaotique ».

## Personas

**Par tranche d'âge**

| | Phrase type | Gains | Pains | Besoins clés |
|---|---|---|---|---|
| **20 ans** | « On fait quoi ce soir ? » | premiers cercles, nouvelles connexions, soirées | peur du samedi soir, budget, cercle éphémère | organiser les soirées, budget, communiquer, groupe d'étude |
| **30 ans** | « On se fait une bouffe ? » | garder le contact, planifier | éloignement, contraintes pro/perso, prise d'initiative | maintenir le contact, partager photos et événements de vie, logistique, lancer une initiative |
| **40 ans** | « J'ai le second qui vient d'arriver » | garder contact, concilier famille et amis, souvenirs | place de la famille, éloignement | album photo, souvenirs de vie, planifier, trouver une date qui convient à tous |

**Par usage**

| Rôle | Phrase | Besoins |
|---|---|---|
| **Orga** | « Et si on se faisait un truc ? » | créer un event, administration |
| **Canceler** | « Je peux pas ! » | choix de date, **refuser un event** facilement |
| **Follower** | « Trop cool, il y a machin qui… » | suivre les instructions, discuter |
| **Daron** | « Il y a l'anniversaire du dernier » | events adaptés aux enfants, planifier |
| **Crazy share** | « Photos de mes vacances ! » | discuter, partager |
| **Le silencieux** | « … » | **répondre par des réactions**, notifications |

**Par type de groupe** : Hobbies (« Match jeudi »), Famille / « Tonton à Noël » (liste de cadeaux, journal de famille), After work et Bar (« Bière ! », « qui est dispo ? », éphémère), Amis (« Pendaison de créma ! », planifier, logistique).

## Retours sur la V1 (slide de rétro)

- ✅ Points positifs : focus group, define, démographie des personas, positionnement, flow.
- ⚠️ À améliorer :
  - le look & feel manque d'impact ;
  - le storytelling « cercle → tribu » est améliorable ;
  - **animations** ;
  - **barre de progression** ;
  - construire les wireframes par composant n'était pas une bonne idée pour une V1.

## Ce que ça implique pour l'app

- **Event** : le To Do doit répondre à « qui prend quoi / qui paye quoi ». Le choix de date doit être un vote (« qui est dispo ? »). Refuser doit être simple et sans culpabilité (Canceler).
- **Chat** : permettre de réagir sans écrire (le Silencieux), pour éviter le chaos type WhatsApp.
- **Souvenirs** : des albums rattachés à une tribu ou à un event.
- **Flows multi-étapes** (sign in, création) : ajouter une barre de progression et des transitions animées.
- **Ton** : chaleureux, « tribu », proches. Jamais « réseau » ni « rencontres ».
