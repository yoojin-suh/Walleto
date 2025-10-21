# Alembic Database Migrations Guide

Alembic is a database migration tool for SQLAlchemy. It allows you to track and apply changes to your database schema over time.

## Setup (Already Complete)

Alembic has been initialized and configured for this project. The configuration includes:
- `alembic/` - Migration scripts directory
- `alembic/versions/` - Individual migration files
- `alembic.ini` - Alembic configuration
- `alembic/env.py` - Migration environment (configured to use app settings and models)

## Common Commands

### 1. Create a New Migration (After Changing Models)

When you modify your SQLAlchemy models (add/remove/change columns), create a migration:

```bash
# Activate virtual environment first
source venv/bin/activate

# Auto-generate migration based on model changes
alembic revision --autogenerate -m "Description of changes"
```

Example:
```bash
alembic revision --autogenerate -m "Add email verification column to users"
```

This will:
- Compare your models with the current database schema
- Create a new migration file in `alembic/versions/`
- Detect added/removed/modified columns automatically

### 2. Apply Migrations (Upgrade Database)

After creating a migration, apply it to your database:

```bash
# Apply all pending migrations
alembic upgrade head

# Apply one migration at a time
alembic upgrade +1

# Upgrade to specific revision
alembic upgrade <revision_id>
```

### 3. Downgrade (Rollback Changes)

If you need to undo migrations:

```bash
# Rollback one migration
alembic downgrade -1

# Rollback to specific revision
alembic downgrade <revision_id>

# Rollback all migrations
alembic downgrade base
```

### 4. Check Current Migration Status

```bash
# Show current revision
alembic current

# Show migration history
alembic history

# Show pending migrations
alembic show head
```

### 5. Create Empty Migration (Manual Changes)

If you need to write custom SQL or logic:

```bash
alembic revision -m "Custom migration description"
```

Then edit the generated file in `alembic/versions/` to add your custom upgrade/downgrade logic.

## Typical Workflow

### Making Model Changes

1. **Edit your model** (e.g., `app/models/user.py`):
   ```python
   # Add a new column
   is_verified = Column(Boolean, default=False)
   ```

2. **Create migration**:
   ```bash
   source venv/bin/activate
   alembic revision --autogenerate -m "Add is_verified to users"
   ```

3. **Review the generated migration** in `alembic/versions/`:
   - Check that it detected the changes correctly
   - Make any manual adjustments if needed

4. **Apply the migration**:
   ```bash
   alembic upgrade head
   ```

5. **Restart your application**:
   ```bash
   uvicorn app.main:app --reload
   ```

## Important Notes

### ✅ DO:
- Always review auto-generated migrations before applying them
- Create a new migration for each logical change
- Use descriptive migration messages
- Test migrations on development before production
- Keep migrations in version control (git)

### ❌ DON'T:
- Don't edit migrations after they've been applied to production
- Don't delete migration files
- Don't modify models without creating migrations
- Don't skip migrations (always apply them in order)

## Troubleshooting

### "Target database is not up to date"
Your database is behind the model changes. Run:
```bash
alembic upgrade head
```

### "No such table" errors
The database tables haven't been created. Run:
```bash
alembic upgrade head
```

### Migration conflicts
If you get conflicts, you may need to:
1. Check `alembic current` to see your current revision
2. Look at `alembic history` to see the migration chain
3. Manually resolve conflicts in migration files

### Start fresh (Development only - DELETES ALL DATA)
```bash
# Drop all tables
python drop_tables.py

# Recreate from migrations
alembic upgrade head
```

## Production Deployment

When deploying to production:

1. **Backup your database** before running migrations
2. Run migrations during deployment:
   ```bash
   alembic upgrade head
   ```
3. Consider using `alembic upgrade head --sql` to review SQL first
4. Test rollback procedure (`alembic downgrade -1`)

## File Structure

```
backend/
├── alembic/                  # Alembic directory
│   ├── versions/            # Migration files (auto-generated)
│   │   └── 5080f22f85f2_initial_migration.py
│   ├── env.py              # Migration environment config
│   ├── README              # Alembic readme
│   └── script.py.mako      # Migration template
├── alembic.ini             # Alembic configuration
├── app/
│   └── models/            # Your SQLAlchemy models
└── drop_tables.py         # Utility to drop all tables (dev only)
```

## Example Scenarios

### Adding a new column
```bash
# 1. Edit model
# 2. Create migration
alembic revision --autogenerate -m "Add phone_number to users"
# 3. Apply
alembic upgrade head
```

### Adding a new table
```bash
# 1. Create new model file in app/models/
# 2. Import it in app/models/__init__.py
# 3. Import it in alembic/env.py
# 4. Create migration
alembic revision --autogenerate -m "Add notifications table"
# 5. Apply
alembic upgrade head
```

### Renaming a column
```bash
# 1. Use alembic.op.alter_column() in migration
alembic revision -m "Rename username to user_name"
# 2. Edit the migration file manually:
#    op.alter_column('users', 'username', new_column_name='user_name')
# 3. Apply
alembic upgrade head
```

## Learn More

- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [Auto-generating Migrations](https://alembic.sqlalchemy.org/en/latest/autogenerate.html)
- [Tutorial](https://alembic.sqlalchemy.org/en/latest/tutorial.html)
