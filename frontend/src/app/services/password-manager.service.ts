import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PasswordEntryDto } from '../models/dtos/PasswordEntryDto';
import { PasswordEntryCreateRequestDto } from '../models/dtos/PasswordEntryCreateRequestDto';
import { PasswordRevealResponseDto } from '../models/dtos/PasswordRevealResponseDto';

@Injectable({
  providedIn: 'root',
})
export class PasswordManagerService {
  private apiUrl = environment.passwordManagerApiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PasswordEntryDto[]> {
    return this.http.get<PasswordEntryDto[]>(`${this.apiUrl}/passwords`);
  }

  create(payload: PasswordEntryCreateRequestDto): Observable<PasswordEntryDto> {
    return this.http.post<PasswordEntryDto>(`${this.apiUrl}/passwords`, payload);
  }

  update(
    id: number,
    payload: PasswordEntryCreateRequestDto,
  ): Observable<PasswordEntryDto> {
    return this.http.put<PasswordEntryDto>(`${this.apiUrl}/passwords/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/passwords/${id}`);
  }

  reveal(id: number): Observable<PasswordRevealResponseDto> {
    return this.http.get<PasswordRevealResponseDto>(
      `${this.apiUrl}/passwords/${id}/reveal`,
    );
  }
}

