/**Типы для задач(tasks) */
/** Строка из таблицы `tasks` в том виде, как её возвращает драйвер `pg` по умолчанию */
// CREATE TABLE tasks(
//         id SERIAL PRIMARY KEY NOT NULL,
//         project_id INTEGER NOT NULL,
//         title TEXT NOT NULL,
//         is_done BOOLEN NOT NULL DEFAULT false,
//         created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//         FOREIGN KEY (user_id) REFERENCES projects(id)
//       );

export type TaskRowDb = {
  id: number;
  project_id: number;
  //допиши сам
  title: string;
  is_done: boolean;
  created_at: Date;
};

export type NewTaskInput = {
  /*допиши сам*/
  project_id: number;
  title: string;
  is_done?: boolean;
  created_at?: Date;
};

export type UpdateTaskInput = {
  /*допиши сам*/
  project_id: number;
  title: string;
  is_done: boolean;
  created_at: Date;
};

// export type NewProjectInput = {
//   name: string;
//   description?: string;
//   status?: 'todo' | 'in_progress' | 'done';
// };

// /**
//  * Тело запроса при обновлении проекта через PUT.
//  * Для «настоящего PUT» ожидаем ПОЛНУЮ замену ресурса — все поля обязательны.
//  */
// export type UpdateProjectInput = {
//   name: string;
//   description: string;
//   status: 'todo' | 'in_progress' | 'done';
// };
