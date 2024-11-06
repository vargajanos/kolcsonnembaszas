# Feladat: Kölcsönző RendszerFeladat: Kölcsönző Rendszer
A projekt célja, hogy a tanulók egy alapvető kölcsönző rendszert építsenek, amelyben a felhasználók kölcsönözhetnek könyveket vagy filmeket, követhetik kölcsönzési státuszukat, és visszaadhatják a kölcsönzött tárgyakat. Az alkalmazás egyszerű felületet kínál, amely EJS sablonokat használ a nézetekhez, és MySQL-t az adatbázis kezeléséhez.

### Adatbázis Struktúra
A rendszer három fő táblát használ:

###### users – a felhasználók adatai

- user_id – egyedi azonosító (INT)
- name – felhasználó neve (VARCHAR)
- email – email cím (VARCHAR)
- membership_date – regisztráció dátuma (DATE)

###### items – kölcsönözhető tárgyak (könyvek, filmek)
- item_id – egyedi azonosító (INT)
- title – tárgy címe (VARCHAR)
- type – típus (ENUM: 'könyv', 'film')
- available – elérhetőség (BOOLEAN)

###### rentals – kölcsönzések

- rental_id – egyedi azonosító (INT)
- user_id – kölcsönző felhasználó azonosítója (INT)
- item_id – kölcsönzött tárgy azonosítója (INT)
- rental_date – kölcsönzés dátuma (DATE)
- return_date – visszahozás dátuma (DATE, alapértelmezett NULL, ha még nincs visszahozva)
### Feladatok
- Felhasználói regisztráció: Készíts egy űrlapot, ahol a felhasználók megadhatják a nevüket és az e-mail címüket. A regisztráció dátuma automatikusan kerül az adatbázisba.

- Tárgyak listázása és kölcsönzés:

- Hozz létre egy oldalt, amely listázza az összes elérhető tárgyat (könyvek és filmek), csak azokat mutatva, amelyek elérhetők (available = true).
- Minden tárgy mellett legyen egy "Kölcsönzés" gomb. Ha a felhasználó rákattint, hozz létre egy új bejegyzést a rentals táblában, és állítsd available = false-ra az adott tárgynál.
- Kölcsönzések megtekintése:

- Készíts egy oldalt, ahol a felhasználók megnézhetik az aktuális és korábbi kölcsönzéseiket.
- Az oldalon jelenjen meg a kölcsönzés dátuma és a tárgy címe, valamint a visszahozás dátuma, ha már visszavitték.

###### Visszahozás kezelése:

- Minden kölcsönzött tárgy mellett jelenjen meg egy "Visszahozás" gomb.
- Ha a felhasználó rákattint a gombra, a rendszer frissítse a return_date mezőt az aktuális dátummal, és állítsa available = true értékre a tárgyaknál.
- Összetett SQL Lekérdezések:

- Listázd ki azokat a tárgyakat, amelyek még nem lettek visszahozva.
- Számold meg, hogy hány könyvet és filmet kölcsönöztek ki összesen.
- Extrák (haladó tanulóknak)
- Keresés és szűrés: Készíts keresési lehetőséget a kölcsönözhető tárgyak között, ahol a felhasználók cím vagy típus szerint szűrhetnek.
- Felhasználói statisztikák: Listázd a legtöbb kölcsönzéssel rendelkező felhasználókat.
- Értesítések: Adj hozzá funkciót, amely e-mail értesítést küld, ha egy kölcsönzött tárgy visszahozása késik.
