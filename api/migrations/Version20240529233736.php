<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240529233736 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE music ADD image_id UUID DEFAULT NULL');
        $this->addSql('COMMENT ON COLUMN music.image_id IS \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE music ADD CONSTRAINT FK_CD52224A3DA5256D FOREIGN KEY (image_id) REFERENCES media_object (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_CD52224A3DA5256D ON music (image_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE music DROP CONSTRAINT FK_CD52224A3DA5256D');
        $this->addSql('DROP INDEX IDX_CD52224A3DA5256D');
        $this->addSql('ALTER TABLE music DROP image_id');
    }
}
