import {getStudentByIsuId} from './database.js'

// валидация, типо бизнес логика

export async function validateStudent(student, id) {

    let newIsuStudent = await getStudentByIsuId(student.isuId);
    if (newIsuStudent && ((id && (newIsuStudent.id !== Number(id))) || (!id))) {
        throw new Error(`ИСУ ${ student.isuId } уже занят другим студентом!`)
    };

    student.name = student.name.trim();
    student.surname = student.surname.trim();
    student.patronymic = student.patronymic.trim();
    student.dormitoryNumber = student.dormitoryNumber.trim();
    student.room = student.room.trim();
    student.notes = student.notes.trim()

    const allowedCharactersFIO = /^[\p{L} -]+$/u;
    const hasLetterFIO = /\p{L}/u;

    if (!allowedCharactersFIO.test(student.name) || !hasLetterFIO.test(student.name)) {
        throw new Error("Имя должно содержать буквы; допускаются пробелы и дефис");
    };

    if (!allowedCharactersFIO.test(student.surname) || !hasLetterFIO.test(student.surname)) {
        throw new Error("Фамилия должна содержать буквы; допускаются пробелы и дефис");
    };

    if ((student.patronymic !== "") && (!allowedCharactersFIO.test(student.patronymic) || !hasLetterFIO.test(student.patronymic))) {
        throw new Error("Отчество должно содержать буквы; допускаются пробелы и дефис");
    };

    const allowedCharactersDormitoryRoom = /^[\p{L}\p{N}/-]*$/u;

    if (!allowedCharactersDormitoryRoom.test(student.dormitoryNumber)) {
        throw new Error("В поле 'Номер общежития' допускаются только цифры, буквы и символы '/' и '-'");
    };

    if (!allowedCharactersDormitoryRoom.test(student.room)) {
        throw new Error("В поле 'Комната' допускаются только цифры, буквы и символы '/' и '-'");
    };


    return student;
};