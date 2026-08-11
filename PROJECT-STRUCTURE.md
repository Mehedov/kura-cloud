# Project structure

Проект использует Feature-Sliced Design поверх Next.js App Router.

```text
src/
├── app/                         # Только App Router, layout и route-adapters
├── page-compositions/           # Композиции экранов FSD
│   ├── auth-page/
│   ├── dashboard-page/
│   ├── folders-page/
│   ├── folder-page/
│   ├── photos-page/
│   ├── shared-page/
│   └── trash-page/
├── widgets/                     # Крупные блоки и локальное состояние
│   ├── app-shell/
│   ├── navigation/
│   ├── dashboard/
│   ├── folder-browser/
│   └── global-modals/
├── features/                    # Пользовательские действия
│   ├── auth-by-email/
│   ├── upload-files/
│   ├── create-folder/
│   ├── manage-resource/
│   ├── share-resource/
│   ├── profile-logout/
│   └── folder-filters/
├── entities/                    # Бизнес-сущности и их API
│   ├── user/
│   ├── session/
│   ├── folder/
│   ├── file/
│   ├── share/
│   ├── storage/
│   └── resource/
└── shared/                      # Техническая инфраструктура и UI
    ├── api/
    ├── config/
    ├── hooks/
    ├── lib/
    ├── providers/
    ├── theme/
    └── ui/
```

Направление зависимостей:

```text
app → page-compositions → widgets → features → entities → shared
```

`src/pages` намеренно не используется: Next.js резервирует этот каталог под Pages Router и воспринимает вложенные `.tsx` как страницы. Поэтому FSD-слой экранных композиций называется `page-compositions`.
