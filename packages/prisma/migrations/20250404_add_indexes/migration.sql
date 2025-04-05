-- Indizes für häufig abgefragte Felder hinzufügen

-- Indizes für Category-Tabelle
CREATE INDEX "Category_guild_id_idx" ON "Category"("guild_id");
CREATE INDEX "Category_name_idx" ON "Category"("name");
CREATE INDEX "Category_discordCategoryId_idx" ON "Category"("discordCategoryId");

-- Indizes für Zone-Tabelle
CREATE INDEX "Zone_guild_id_idx" ON "Zone"("guild_id");
CREATE INDEX "Zone_categoryId_idx" ON "Zone"("categoryId");
CREATE INDEX "Zone_zoneKey_idx" ON "Zone"("zoneKey");
CREATE INDEX "Zone_zoneName_idx" ON "Zone"("zoneName");
CREATE INDEX "Zone_discordId_idx" ON "Zone"("discordId");
