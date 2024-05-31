<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240529232831 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE media_object (id UUID NOT NULL, file_path VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN media_object.id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE music (id UUID NOT NULL, playlist_id UUID DEFAULT NULL, name TEXT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_CD52224A6BBD148 ON music (playlist_id)');
        $this->addSql('COMMENT ON COLUMN music.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN music.playlist_id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE playlist (id UUID NOT NULL, name TEXT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN playlist.id IS \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE music ADD CONSTRAINT FK_CD52224A6BBD148 FOREIGN KEY (playlist_id) REFERENCES playlist (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE music DROP CONSTRAINT FK_CD52224A6BBD148');
        $this->addSql('DROP TABLE media_object');
        $this->addSql('DROP TABLE music');
        $this->addSql('DROP TABLE playlist');
    }
}
