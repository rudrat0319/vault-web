import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasswordManagerService } from '../../services/password-manager.service';
import { PasswordEntryDto } from '../../models/dtos/PasswordEntryDto';
import { PasswordEntryCreateRequestDto } from '../../models/dtos/PasswordEntryCreateRequestDto';

@Component({
  selector: 'app-password-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password-manager.component.html',
  styleUrl: './password-manager.component.scss',
})
export class PasswordManagerComponent implements OnInit {
  entries: PasswordEntryDto[] = [];
  isLoading = false;
  hasLoadError = false;

  isCreateOpen = false;
  isEditing = false;
  editingId: number | null = null;
  isSaving = false;
  hasSaveError = false;
  createForm: FormGroup;

  revealedPasswords = new Map<number, string>();
  revealLoadingIds = new Set<number>();

  constructor(
    private fb: FormBuilder,
    private passwordManagerService: PasswordManagerService,
  ) {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      url: [''],
      notes: ['', [Validators.maxLength(500)]],
      categoryId: [''],
    });
  }

  ngOnInit(): void {
    this.loadEntries();
  }

  addPassword(): void {
    this.hasSaveError = false;
    this.isEditing = false;
    this.editingId = null;
    this.createForm.reset();
    this.isCreateOpen = true;
  }

  editPassword(entry: PasswordEntryDto): void {
    this.hasSaveError = false;
    this.isEditing = true;
    this.editingId = entry.id;
    this.createForm.reset({
      name: entry.name ?? '',
      username: entry.username ?? '',
      password: '',
      url: entry.url ?? '',
      notes: entry.notes ?? '',
      categoryId: entry.categoryId ?? '',
    });
    this.isCreateOpen = true;
  }

  closeCreateModal(): void {
    if (this.isSaving) {
      return;
    }
    this.isCreateOpen = false;
  }

  submitCreate(): void {
    this.hasSaveError = false;

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const raw = this.createForm.value;
    const categoryId =
      raw.categoryId === null || raw.categoryId === undefined || raw.categoryId === ''
        ? null
        : Number(raw.categoryId);

    const payload: PasswordEntryCreateRequestDto = {
      name: String(raw.name ?? '').trim(),
      username: String(raw.username ?? '').trim(),
      password: String(raw.password ?? ''),
      url: raw.url ? String(raw.url).trim() : null,
      notes: raw.notes ? String(raw.notes).trim() : null,
      categoryId: Number.isFinite(categoryId as number) ? (categoryId as number) : null,
    };

    this.isSaving = true;

    const req$ =
      this.isEditing && this.editingId !== null
        ? this.passwordManagerService.update(this.editingId, payload)
        : this.passwordManagerService.create(payload);

    req$.subscribe({
      next: () => {
        this.isSaving = false;
        this.isCreateOpen = false;
        this.loadEntries();
      },
      error: (err) => {
        this.isSaving = false;
        this.hasSaveError = true;
        console.error(
          this.isEditing
            ? 'Failed to update password entry'
            : 'Failed to create password entry',
          err,
        );
      },
    });
  }

  deletePassword(entry: PasswordEntryDto): void {
    const confirmed = window.confirm(
      `Delete password entry "${entry.name}"? This cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }

    this.passwordManagerService.delete(entry.id).subscribe({
      next: () => {
        this.entries = this.entries.filter((e) => e.id !== entry.id);
        this.revealedPasswords.delete(entry.id);
        this.revealLoadingIds.delete(entry.id);
      },
      error: (err) => {
        console.error('Failed to delete password entry', err);
      },
    });
  }

  retry(): void {
    this.loadEntries();
  }

  trackById(_: number, item: PasswordEntryDto): number {
    return item?.id ?? 0;
  }

  isRevealed(entryId: number): boolean {
    return this.revealedPasswords.has(entryId);
  }

  getRevealed(entryId: number): string {
    return this.revealedPasswords.get(entryId) ?? '';
  }

  toggleReveal(entryId: number): void {
    if (this.isRevealed(entryId)) {
      this.revealedPasswords.delete(entryId);
      return;
    }

    if (this.revealLoadingIds.has(entryId)) {
      return;
    }

    this.revealLoadingIds.add(entryId);
    this.passwordManagerService.reveal(entryId).subscribe({
      next: (res) => {
        this.revealLoadingIds.delete(entryId);
        this.revealedPasswords.set(entryId, res.password);
      },
      error: (err) => {
        this.revealLoadingIds.delete(entryId);
        // Keep reveal errors local for now; don't replace the entire table state.
        // Useful details still available in devtools.
        console.error('Failed to reveal password', err);
      },
    });
  }

  private loadEntries(): void {
    this.isLoading = true;
    this.hasLoadError = false;

    this.passwordManagerService.getAll().subscribe({
      next: (data) => {
        this.entries = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.hasLoadError = true;
        console.error('Failed to load password entries', err);
      },
    });
  }
}

