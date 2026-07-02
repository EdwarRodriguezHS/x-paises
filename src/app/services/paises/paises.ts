import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Pais } from '../../interfaces/pais';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private apiUrl = '/api/countries/v5';
  private apiKey = 'rc_live_919ebce893eb41d982a5b92b8f86a5d5';

  constructor(private http: HttpClient) {}

  buscarPaises(query: string): Observable<Pais[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`
    });

    return this.http.get<any>(`${this.apiUrl}?q=${query}`, { headers }).pipe(
      map(data => {
        if (!data?.data?.objects) return [];
        return data.data.objects.map((pais: any) => ({
          nombre: pais.names?.common || 'Sin nombre',
          bandera: pais.flag?.url_png || '',
          capital: pais.capitals?.[0]?.name || 'Sin capital',
          poblacion: pais.population || 0,
          region: pais.region || 'Sin región',
          latitud: pais.capitals?.[0]?.coordinates?.lat || 0,
          longitud: pais.capitals?.[0]?.coordinates?.lng || 0
        }));
      })
    );
  }
}