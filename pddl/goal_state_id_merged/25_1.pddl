(define (problem generated)
  (:domain manip)
  (:objects
    container_05 - container
    office_02 office_05 office_08 - item
  )
  (:init
    (clear office_02)
    (clear office_05)
    (clear office_08)
    (handempty)
    (in office_02 container_05)
    (ontable container_05)
    (ontable office_05)
    (ontable office_08)
  )
  (:goal (and
    (clear office_02)
    (clear office_05)
    (clear office_08)
    (handempty)
    (in office_08 container_05)
    (ontable container_05)
    (ontable office_02)
    (ontable office_05)
  ))
)
