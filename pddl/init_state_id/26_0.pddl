(define (problem scene1)
  (:domain manip)
  (:objects
    office_04 - item
    office_07 - item
    office_09 - item
    office_10 - item
  )
  (:init
    (ontable office_04)
    (ontable office_07)
    (ontable office_09)
    (ontable office_10)
    (clear office_04)
    (clear office_07)
    (clear office_09)
    (clear office_10)
    (handempty)
  )
  (:goal (and ))
)