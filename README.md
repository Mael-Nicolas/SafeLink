# 🛡️ SafeLink

**SafeLink** est une extension de navigateur qui vérifie automatiquement la sécurité des liens avant que vous ne cliquiez dessus. Naviguez en toute tranquillité grâce à une protection en temps réel contre les sites de phishing et les URLs malveillantes.

## 🎥 Démo

Regardez SafeLink en action : [Vidéo de démonstration](https://youtu.be/FgyTcUIoBXk)

## ✨ Fonctionnalités

- 🔍 **Vérification automatique** : Analyse les liens au survol après 1,5 seconde
- 🎯 **Badge visuel** : Affiche un indicateur de sécurité clair (sûr/pas sûr)
- 🔐 **Analyse privée** : Utilise l'API PhiShark en mode privé (vos recherches ne sont pas publiques)
- 🚀 **Léger et rapide** : Aucun impact sur les performances de navigation
- 🎛️ **Toggle activable** : Activez ou désactivez l'extension à tout moment via la popup
- 🌐 **Compatible** : Fonctionne sur Chrome, Edge, Brave et autres navigateurs Chromium

## 📦 Installation

### Mode développeur (local)

1. **Clonez le repository**
   ```bash
   git clone https://github.com/Mael-Nicolas/SafeLink.git
   ```

2. **Chargez l'extension dans Chrome**
   - Ouvrez `chrome://extensions/`
   - Activez le "Mode développeur" (en haut à droite)
   - Cliquez sur "Charger l'extension non empaquetée"
   - Sélectionnez le dossier `SafeLink`

3. **C'est prêt !** L'icône SafeLink apparaît dans votre barre d'outils

## 🚀 Utilisation

1. **Navigation normale** : Survolez n'importe quel lien avec votre souris
2. **Attente de vérification** : Après 0,5s, un badge bleu "Vérification..." apparaît
3. **Résultat** : Après 1,5s de survol total, le badge devient :
   - ✅ **Vert "Sûr"** : Le lien est sécurisé
   - ⚠️ **Rouge "Pas sûr"** : Le lien est potentiellement dangereux

### Toggle on/off

Cliquez sur l'icône SafeLink dans la barre d'outils pour activer/désactiver la vérification automatique.

## 🛠️ Technologies

- **Manifest V3** : Dernière version des extensions Chrome
- **PhiShark API** : Service gratuit d'analyse de phishing (10 requêtes/min)
- **Service Worker** : Analyse en arrière-plan sans ralentir le navigateur
- **Content Scripts** : Détection des liens et affichage des badges

## 📁 Structure du projet

```
SafeLink/
├── manifest.json           # Configuration de l'extension
├── images/                 # Logo et icônes
├── popup/                  # Interface de la popup
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
└── scripts/
    ├── service-worker.js   # Logique d'analyse des URLs
    ├── content.js          # Détection des survols et badges
    └── styles.css          # Styles des badges
```

## 🔒 Sécurité et confidentialité

- ✅ Aucune donnée personnelle collectée
- ✅ Analyse en mode privé (vos URLs ne sont pas enregistrées publiquement)
- ✅ Pas de tracking ni d'analytique
- ✅ Code source ouvert et auditable
- ✅ API gratuite sans compte requis

## 📊 Limites

- **Rate limiting** : 10 requêtes par minute par IP (limite de l'API PhiShark)
- **Analyse uniquement au survol** : Les liens ne sont vérifiés que si vous les survolez 1,5 seconde
- **Dépendance API** : Nécessite une connexion internet et disponibilité de PhiShark
